import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Url from './entities/url.entity.js';
import { AppData } from './data-source.js';

@Injectable()
export default class UrlService {
  readonly urlRepo: Repository<Url>;
  constructor() {
    this.urlRepo = AppData.getRepository(Url);
  }

  async createUrlMapEntry(key: string, url: string): Promise<Url> {
    const entry = this.urlRepo.create({
      key: key,
      url: url,
    });
    await this.urlRepo.save(entry);
    return entry;
  }

  async getUrlByKey(key: string): Promise<Url | null> {
    return await this.urlRepo.findOne({ where: { key: key } });
  }

  async deleteKey(key: string): Promise<boolean> {
    const r = await this.urlRepo.delete(key);
    return !!r.affected && r.affected > 0;
  }
}
