import { EntityRepository, Repository } from 'typeorm';

import { Districts } from '../entity/Districts';

interface DongInfo {
  nameOfDong: string;
  idOfGu: number;
  nameOfGu: string;
}

@EntityRepository(Districts)
export class DistrictRepository extends Repository<Districts> {
  async saveDongInfos(dongInfos: Array<DongInfo>) {
    const objects = dongInfos.map((dong) =>
      this.create({
        nameOfDong: dong.nameOfDong,
        idOfGu: dong.idOfGu,
        nameOfGu: dong.nameOfGu,
      }));
    return this.save(objects);
  }

  async getAllDistrict() {
    const results = this.find();
    return results;
  }
}
