import { EntityRepository, Repository } from 'typeorm';

import { AbleDistricts } from '../entity/AbleDistricts';
import { getUserRepository, getDistrictRepository } from '..';
import { User } from '../entity/User';

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
}
