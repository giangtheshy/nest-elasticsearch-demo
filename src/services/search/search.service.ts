import { ElasticSearchBody } from '@components/product/product.search.object';
import { Search } from '@elastic/elasticsearch/api/requestParams';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigSearch } from './config/config.search';
import { SearchServiceInterface } from './interface/search.service.interface';

@Injectable()
export class SearchService
  extends ElasticsearchService
  implements SearchServiceInterface<any>
{
  constructor() {
    super(ConfigSearch.searchConfig(process.env.ELASTIC_SEARCH_URL));
  }

  public async insertIndex(bulkData: any): Promise<any> {
    return this.bulk(bulkData)
      .then((res) => res)
      .catch((err) => {
        console.log(err);
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async updateIndex(updateData: any): Promise<any> {
    return this.update(updateData)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async searchIndex(
    searchData: Search<ElasticSearchBody>,
  ): Promise<any> {
    console.log(searchData);

    return this.search(searchData)
      .then((res) => {
        return res.body.hits.hits;
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async deleteIndex(indexData: any): Promise<any> {
    return this.indices
      .delete(indexData)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async deleteDocument(indexData: any): Promise<any> {
    return this.delete(indexData)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
}
