import { EntityRepository, Repository, getManager } from 'typeorm';

import { ApolloError } from 'apollo-server-express';
import { getUserRepository, getDistrictRepository } from '../..';
import { AbleDistricts } from '../../entity/AbleDistricts';
import { Districts } from '../../entity/Districts';
import { User } from '../../entity/User';

@EntityRepository(AbleDistricts)
export class AbleDistrictsRepository extends Repository<AbleDistricts> {
  async findByUser(user: User) {
    const result = await this.find({
      where: { user },
      relations: ['user', 'district'],
    });
    return result;
  }

  async deleteByUser(user: User) {
    return this.delete({ user });
  }

  async saveByDongId(userId: string, dongIds: Array<string>) {
    try {
      const user = await getUserRepository().validateUserId(userId);
      const objects = dongIds.map((dongId) =>
        this.create({
          user,
          district: getDistrictRepository().create({ idOfDong: dongId }),
        }));
      return await getManager().transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.delete(AbleDistricts, { user });
          await transactionalEntityManager.save(objects);
        },
      );
    } catch (error) {
      console.log(error);
      throw new ApolloError(
        'Able District Save Error',
        'ABLE_DISTRICT_SAVE_ERROR',
      );
    }
  }

  async findByDongIds(dongIds: Array<string>) {
    try {
      // console.log('findByDongIds: ', dongIds);
      const results = await this.createQueryBuilder('able_districts')
        .where('districtIdOfDong IN (:...dongIds)', { dongIds })
        .getMany();
      // console.log(results);
      return results;
    } catch (error) {
      // console.log(error);
      throw new ApolloError(
        'Able District Find Error',
        'ABLE_DISTRICT_FIND_ERROR',
      );
    }
  }

  async batchUsers(ableDistrictIds: readonly string[]) {
    const users = await this.createQueryBuilder('ableDistricts')
      .leftJoinAndSelect('ableDistricts.user', 'user')
      .where('ableDistricts.id IN (:...ableDistrictIds)', { ableDistrictIds })
      .getMany();
    const userMap: { [key: string]: User } = {};
    users.forEach((u) => {
      userMap[u.id] = u.user;
    });
    return ableDistrictIds.map((id) => userMap[id]);
  }

  async batchDistricts(ableDistrictIds: readonly string[]) {
    const districts = await this.createQueryBuilder('ableDistricts')
      .leftJoinAndSelect('ableDistricts.district', 'districts')
      .where('ableDistricts.id IN (:...ableDistrictIds)', { ableDistrictIds })
      .getMany();
    const ableDistrictMap: { [key: string]: Districts } = {};
    districts.forEach((u) => {
      ableDistrictMap[u.id] = u.district;
    });
    return ableDistrictIds.map((id) => ableDistrictMap[id]);
  }
}
