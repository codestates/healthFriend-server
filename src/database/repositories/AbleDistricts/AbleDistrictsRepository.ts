import { EntityRepository, Repository } from 'typeorm';

import { getUserRepository, getDistrictRepository } from '../..';
import { AbleDistricts } from '../../entity/AbleDistricts';
import { Districts } from '../../entity/Districts';
import { User } from '../../entity/User';

@EntityRepository(AbleDistricts)
export class AbleDistrictsRepository extends Repository<AbleDistricts> {
  async findByUser(user: User) {
    const result = await this.find({ user });
    return result;
  }

  async findByUserId(userId: string) {
    const user = getUserRepository().create({ id: userId });
    const result = await this.findByUser(user);
    return result;
  }

  async deleteByUser(user: User) {
    return this.delete({ user });
  }

  async saveByDongId(userId: string, dongIds: Array<string>) {
    try {
      const user = getUserRepository().create({ id: userId });
      const objects = dongIds.map((dongId) => ({
        user,
        district: getDistrictRepository().create({ idOfDong: dongId }),
      }));
      // console.log(objects);
      await this.deleteByUser(user);
      const results = await this.save(objects);
      // console.log(results);
      return results;
    } catch (error) {
      console.log(error);
      return error;
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
      console.log(error);
      return error;
    }
  }

  async findUserByAbleDistrictId(ableDistrictId: string) {
    const result = await this.findOne({
      where: { id: ableDistrictId },
      relations: ['user'],
    });
    // console.log('findUserByAbleDistrictId: ', result);
    return result?.user;
  }

  async findDistrictByAbleDistrictId(ableDistrictId: string) {
    const result = await this.findOne({
      where: { id: ableDistrictId },
      relations: ['district'],
    });
    // console.log('findDistrictByAbleDistrictId: ', result);
    return result?.district;
  }

  async batchDistricts(ableDistrictIds: readonly string[]) {
    const users = await this.createQueryBuilder('ableDistricts')
      .leftJoinAndSelect('ableDistricts.district', 'districts')
      .where('ableDistricts.id IN (:...ableDistrictIds)', { ableDistrictIds })
      .getMany();
    const ableDistrictMap: { [key: string]: Districts } = {};
    users.forEach((u) => {
      ableDistrictMap[u.id] = u.district;
    });
    return ableDistrictIds.map((id) => ableDistrictMap[id]);
  }
}
