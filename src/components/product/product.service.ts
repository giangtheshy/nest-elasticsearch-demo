import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SearchServiceInterface } from '@services/search/interface/search.service.interface';
import { ProductElasticIndex } from '@services/search/search-index/product.elastic.index';
import { Model } from 'mongoose';
import { CreateProduct, UpdateProduct } from './dto';
import { Product } from './product.model';
import { ProductSearchObject } from './product.search.object';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private readonly productElasticIndex: ProductElasticIndex,
    @Inject('SearchServiceInterface')
    private readonly searchService: SearchServiceInterface<any>,
  ) {}

  async create(body: CreateProduct) {
    try {
      const product = new this.productModel({ ...body });
      const newProduct: Product = (await product.save()).toObject();

      this.productElasticIndex.insertProductDocument({ ...newProduct });

      return newProduct;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProducts(page: number) {
    try {
      const count = await this.productModel.count().lean();
      const products = await this.productModel
        .find()
        .limit(5)
        .skip((page - 1) * 5)
        .lean();
      return { count, products };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async updateProduct(id: string, body: UpdateProduct) {
    try {
      const product = await this.productModel
        .findByIdAndUpdate(id, { ...body }, { new: true })
        .lean();
      this.productElasticIndex.updateProductDocument({ ...product });
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async deleteProduct(id: string) {
    try {
      await this.productModel.findByIdAndDelete(id);
      this.productElasticIndex.deleteProductDocument(id);
      return { message: 'Delete product successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async search(q: any) {
    const data = ProductSearchObject.searchObject(q);
    return this.searchService.searchIndex(data);
  }
}
