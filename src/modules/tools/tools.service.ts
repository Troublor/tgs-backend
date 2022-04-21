import { Injectable } from '@nestjs/common';
import { Md5 } from 'ts-md5';
import { v1 as uuid } from 'uuid';
import { spawnSync } from 'child_process';
import fs from 'fs';

export enum HttpMethod {
  GET,
  POST,
}

export interface ToolMapping {
  httpMethod: HttpMethod;
  contentType?: string;
  method: (params: string) => string | Promise<string>;
  description: string;
}

@Injectable()
export default class ToolsService {
  public toolMap: { [toolId: string]: ToolMapping } = {
    '1': {
      httpMethod: HttpMethod.GET,
      method: this.md5.bind(this),
      description: 'get the md5 hash of the payload',
    },
    '2': {
      httpMethod: HttpMethod.GET,
      method: this.md5first2.bind(this),
      description:
        'get the first two characters of the md5 hash of the payload',
    },
    '5': {
      httpMethod: HttpMethod.POST,
      contentType: 'plain/text',
      method: this.exeJs.bind(this),
      description: 'execute javascript script',
    },
  };

  public md5(payload: string): string {
    return <string>Md5.hashStr(payload);
  }

  public md5first2(payload: string): string {
    const md5string = <string>Md5.hashStr(payload);
    return md5string.substr(0, 2);
  }

  public exeJs(payload: string): string {
    const tmp_file = `${__dirname}/tmp/${uuid()}.js`;
    const dir = __dirname + '/tmp';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, 744);
    }
    fs.writeFileSync(tmp_file, payload);
    const output = {
      stderr: '',
      stdout: '',
    };
    try {
      const child = spawnSync('node', [tmp_file]);
      output.stdout = child.stdout.toString();
      output.stderr = child.stderr.toString();
    } catch (e) {
      output.stderr = `${e}`;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fs.unlink(tmp_file, () => {});
    return JSON.stringify(output);
  }
}
