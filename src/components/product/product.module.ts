import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductElasticIndex } from '@services/search/search-index/product.elastic.index';
import { SearchService } from '@services/search/search.service';
import { ProductController } from './product.controler';
import { ProductSchema } from './product.model';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  providers: [
    ProductService,
    ProductElasticIndex,
    { provide: 'SearchServiceInterface', useClass: SearchService },
  ],
  controllers: [ProductController],
})
export class ProductModule {}
