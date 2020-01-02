import { EntityRepository, Repository } from 'typeorm';

import { District } from '../entity/District';
import { getDistrictRepository } from '..';

interface DongInfo {
  nameOfDong: string;
  idOfGu: number;
  nameOfGu: string;
}
@EntityRepository(District)
export class DistrictRepository extends Repository<District> {
  async saveDongInfos(dongInfos: Array<DongInfo>) {
    const objects = dongInfos.map((dong) =>
      getDistrictRepository().create({
        nameOfDong: dong.nameOfDong,
        idOfGu: dong.idOfGu,
        nameOfGu: dong.nameOfGu,
      }));
    return this.save(objects);
  }
}
