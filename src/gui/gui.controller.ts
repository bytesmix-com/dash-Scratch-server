import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  Response,
} from '@nestjs/common';
import axios from 'axios';
import { Request as Req, Response as Res } from 'express';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import { writeFile, rm } from 'fs/promises';
import fetch from 'node-fetch';
import * as rawbody from 'raw-body';

import { GUIService } from './gui.service';
import * as initialProject from './initial-project.json';

@Controller('/gui')
export class GUIController {
  constructor(private readonly guiService: GUIService) {}

  @Put('/project/:id')
  async index(@Body() body: any, @Param('id') id: string) {
    await this.guiService.saveProject(id, body);
    return { status: 'ok', 'autosave-interval': '120' };
  }

  @Get('/project/:id')
  async getProject(@Body() body: any, @Param('id') id: string) {
    const project = await this.guiService.getProject(id);

    if (!project) {
      return initialProject;
    } else {
      return project;
    }
  }

  @Post('/asset/:filename')
  async asset(
    @Body() data: any,
    @Request() req: Req,
    @Param('filename') filename: string,
  ) {
    if (req.readable) {
      const raw = await rawbody(req);
      await writeFile(__dirname + '/' + filename, raw);
      const formData = new FormData();
      formData.append('project_key', '01FTAMF4DYFMGQTHJED2RMW0QB');
      formData.append('folder_id', '01FV9XWJR092V29KBJ04068PTA');
      formData.append('file', createReadStream(__dirname + '/' + filename));

      try {
        const fff = await fetch('https://media.branch.so/upload', {
          method: 'post',
          body: formData,
        });
        const data = await fff.json();
        await rm(__dirname + '/' + filename);

        await this.guiService.saveAsset(filename, data.link);

        return {
          status: 'ok',
          'content-name': filename,
        };
      } catch (e) {
        console.log(e);
      }
    } else {
      // body is parsed by NestJS
      console.log('data:', data);
    }
  }

  @Get('/asset/internalapi/asset/:filename/get')
  async getAsset(@Param('filename') filename: string, @Response() res: Res) {
    const savedUrl = await this.guiService.getAssetUrl(filename);
    if (!savedUrl) {
      const data = await axios.get(
        `https://assets.scratch.mit.edu/internalapi/asset/${filename}/get`,
        { responseType: 'arraybuffer' },
      );
      return res.set(data.headers).send(data.data);
    } else {
      const data = await axios.get(savedUrl, { responseType: 'arraybuffer' });
      return res.set(data.headers).send(data.data);
    }
  }

  @Get('/:id')
  getIndex() {
    return {
      a: 1,
    };
  }
}
