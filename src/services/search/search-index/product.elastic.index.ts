import { Inject, Injectable } from '@nestjs/common';
import { Product } from '@components/product/product.model';
import { productIndex } from '../constant/product.elastic';
import { SearchServiceInterface } from '../interface/search.service.interface';

@Injectable()
export class ProductElasticIndex {
  constructor(
    @Inject('SearchServiceInterface')
    private readonly searchService: SearchServiceInterface<any>,
  ) {}

  public async insertProductDocument(product: Product): Promise<any> {
    const data = this.productDocument(product);
    return this.searchService.insertIndex(data);
  }

  public async updateProductDocument(product: Product): Promise<any> {
    await this.deleteProductDocument(product._id);
    const data = this.productDocument(product);
    return this.searchService.insertIndex(data);
  }

  public async deleteProductDocument(prodId: string): Promise<any> {
    const data = {
      index: productIndex._index,
      type: productIndex._type,
      id: prodId,
    };
    return this.searchService.deleteDocument(data);
  }

  private bulkIndex(productId: string): any {
    return {
      _index: productIndex._index,
      _type: productIndex._type,
      _id: productId,
    };
  }

  private productDocument(product: Product): any {
    const bulk = [];
    bulk.push({
      index: this.bulkIndex(product._id),
    });
    delete product._id;

    bulk.push(product);
    return {
      body: bulk,
      index: productIndex._index,
      type: productIndex._type,
    };
  }
}
