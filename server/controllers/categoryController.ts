import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/dbService';

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await dbService.getCategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await dbService.getCategoryBySlug(slug);

    if (!category) {
      res.status(404).json({ success: false, error: 'Category not found.' });
      return;
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      res.status(400).json({ success: false, error: 'Category name and slug are required.' });
      return;
    }

    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = (req.file as any).path;
    }

    const categoryData = {
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      description: description || '',
      imageUrl,
    };

    const newCategory = await dbService.createCategory(categoryData);
    res.status(201).json({ success: true, message: 'Category created successfully.', category: newCategory });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const existingCategory = await dbService.getCategories().then(cats => cats.find(c => c.id === id || c._id === id || c._id?.toString() === id));
    if (!existingCategory) {
      res.status(404).json({ success: false, error: 'Category not found.' });
      return;
    }

    let imageUrl = req.body.imageUrl || existingCategory.imageUrl;
    if (req.file) {
      imageUrl = (req.file as any).path;
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updatedCategory = await dbService.updateCategory(id, updateData);
    res.status(200).json({ success: true, message: 'Category updated successfully.', category: updatedCategory });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await dbService.deleteCategory(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Category not found or failed to delete.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
