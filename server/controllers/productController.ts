import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/dbService';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, featured, sort, page, limit } = req.query;

    const filters: any = {};
    if (category) filters.category = String(category);
    if (featured !== undefined) filters.featured = featured === 'true';
    if (search) filters.search = String(search);

    const options: any = {};
    if (sort) options.sort = String(sort);
    if (page) options.page = parseInt(String(page), 10);
    if (limit) options.limit = parseInt(String(limit), 10);

    const result = await dbService.getProducts(filters, options);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await dbService.getProductById(id);

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, price, originalPrice, category, stockStatus, rating, specs, featured } = req.body;

    if (!title || !description || price === undefined || !category) {
      res.status(400).json({ success: false, error: 'Title, description, price, and category are required.' });
      return;
    }

    // Determine imageUrl: either uploaded file or from text input
    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = (req.file as any).path;
    }

    if (!imageUrl) {
      res.status(400).json({ success: false, error: 'An image URL or uploaded file is required for the product.' });
      return;
    }

    // Parse specifications if stringified
    let parsedSpecs = specs;
    if (typeof specs === 'string') {
      try {
        parsedSpecs = JSON.parse(specs);
      } catch {
        parsedSpecs = [];
      }
    }

    const productData = {
      title,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      imageUrl,
      stockStatus: stockStatus || 'In Stock',
      rating: rating ? parseFloat(rating) : 4.5,
      specs: Array.isArray(parsedSpecs) ? parsedSpecs : [],
      featured: featured === 'true' || featured === true,
    };

    const newProduct = await dbService.createProduct(productData);
    res.status(201).json({ success: true, message: 'Product created successfully.', product: newProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, price, originalPrice, category, stockStatus, rating, specs, featured } = req.body;

    const existingProduct = await dbService.getProductById(id);
    if (!existingProduct) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    let imageUrl = req.body.imageUrl || existingProduct.imageUrl;
    if (req.file) {
      imageUrl = (req.file as any).path;
    }

    let parsedSpecs = specs;
    if (typeof specs === 'string') {
      try {
        parsedSpecs = JSON.parse(specs);
      } catch {
        parsedSpecs = existingProduct.specs;
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (stockStatus !== undefined) updateData.stockStatus = stockStatus;
    if (rating !== undefined) updateData.rating = parseFloat(rating);
    if (parsedSpecs !== undefined) updateData.specs = parsedSpecs;
    if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;

    const updatedProduct = await dbService.updateProduct(id, updateData);
    res.status(200).json({ success: true, message: 'Product updated successfully.', product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await dbService.deleteProduct(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
