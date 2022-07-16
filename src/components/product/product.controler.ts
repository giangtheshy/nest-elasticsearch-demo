import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { query } from 'express';
import { ValidationPipe } from '@shared/pipes/validation.pipe';
import { CreateProduct, UpdateProduct } from './dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  createProduct(@Body() createProduct: CreateProduct) {
    return this.productService.create(createProduct);
  }
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() updateProduct: UpdateProduct) {
    return this.productService.updateProduct(id, updateProduct);
  }
  @Get()
  getProducts(@Query('page') page: number) {
    return this.productService.getProducts(page);
  }
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
  @Get('search')
  searchProduct(@Query() query: any) {
    return this.productService.search(query.q);
  }
}
