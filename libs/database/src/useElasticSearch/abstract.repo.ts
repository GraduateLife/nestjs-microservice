import {
  ObjectPickProperties,
  ObjectPropertyUnset,
} from '@app/common/types/Object';
import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { instanceToPlain } from 'class-transformer';

type EsView = {
  idColumnIndicator: string;
  indexName: string;
  indexActivateOnFields: string[];
};

export abstract class ElasticsearchAbstractRepository {
  constructor(
    private elasticsearchService: ElasticsearchService,
    private esView: EsView,
  ) {}

  async testConnection() {
    const resp = await this.elasticsearchService.info();
    return resp;
  }

  async multiMatchSearch(toMatch: string) {
    const { hits } = await this.elasticsearchService.search({
      index: this.esView.indexName,
      query: {
        multi_match: {
          query: toMatch,
          fields: this.esView.indexActivateOnFields,
        },
      },
    });
    return hits.hits.map((item) => item._source);
  }

  async indexOneDocWithId(
    withId: string,
    data: any,
  ): Promise<WriteResponseBase> {
    const prepared = this.dataPreflight(data);
    const res = await this.elasticsearchService.index({
      index: this.esView.indexName,
      id: withId,
      document: {
        ...prepared,
      },
    });
    return res;
  }

  async updateOneDocWithId(withId: string, data: any) {
    const prepared = this.dataPreflight(data);
    return await this.elasticsearchService.update({
      id: withId,
      index: this.esView.indexName,
      doc: { ...prepared },
    });
  }

  async deleteOneDocById(withId: string) {
    return await this.elasticsearchService.delete({
      id: withId,
      index: this.esView.indexName,
    });
  }

  protected dataPreflight(val: any) {
    let data;
    if (val?.constructor) {
      data = instanceToPlain(val);
    }

    for (const [k, v] of Object.entries(data)) {
      if (Array.isArray(v)) {
        const nv = v.join(',');
        data[k] = nv;
      }
    }
    const filtered = ObjectPickProperties(
      data,
      this.esView.indexActivateOnFields,
    );
    return ObjectPropertyUnset(filtered, [this.esView.idColumnIndicator]);
  }
}
