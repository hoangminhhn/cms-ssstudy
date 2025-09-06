"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import BookHighlights from '@/components/books/BookHighlights';
import BookIncludes from '@/components/books/BookIncludes';

const AddBookForm: React.FC = () => {
  const [promotionDateRange, setPromotionDateRange] = React.useState<{ from?: Date; to?: Date } | undefined>(undefined);

  return (
    <div className="space-y-6">
      {/* Thông tin chung */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image Upload */}
            <div className="col-span-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center min-h-[150px]">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <Button variant="outline" className="bg-orange-500 hover:bg-orange-600 text-white">Thêm hình</Button>
            </div>
            {/* Input Fields */}
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="book-id">Mã sách</Label>
                <Input id="book-id" placeholder="Nhập mã sách" />
              </div>
              <div>
                <Label htmlFor="product-name">Tên sản phẩm</Label>
                <Input id="product-name" placeholder="Nhập tên sản phẩm" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="preview-link">Link bản xem thử</Label>
                <Input id="preview-link" placeholder="Nhập link bản xem thử" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="grade-level">Cấp học</Label>
              <Select>
                <SelectTrigger id="grade-level">
                  <SelectValue placeholder="Chọn cấp học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cap1">Cấp 1</SelectItem>
                  <SelectItem value="cap2">Cấp 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Môn học</Label>
              <Select>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toan">Toán</SelectItem>
                  <SelectItem value="van">Văn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="book-category">Danh mục sách</Label>
              <Select>
                <SelectTrigger id="book-category">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">Danh mục 1</SelectItem>
                  <SelectItem value="category2">Danh mục 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Copied field placed beside the original, label changed to "Danh mục" */}
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category1">Danh mục 1</SelectItem>
                  <SelectItem value="category2">Danh mục 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="featured-book" />
              <Label htmlFor="featured-book">Nổi bật</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="display-book" />
              <Label htmlFor="display-book">Hiển thị</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Giá và khuyến mãi */}
      <Card>
        <CardHeader>
          <CardTitle>Giá và khuyến mãi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="product-price">Giá sản phẩm</Label>
            <Input id="product-price" placeholder="Nhập giá sản phẩm" />
          </div>
          <div>
            <Label htmlFor="promotion-price">Giá khuyến mãi</Label>
            <Input id="promotion-price" placeholder="Nhập giá khuyến mãi" />
          </div>
          <div>
            <Label htmlFor="difference">Chênh lệch</Label>
            <Input id="difference" value="0%" readOnly className="bg-gray-100 dark:bg-gray-800" />
          </div>
          <div>
            <Label htmlFor="promotion-time">Chọn thời gian khuyến mãi</Label>
            <Select>
              <SelectTrigger id="promotion-time">
                <SelectValue placeholder="Khoảng thời gian cụ thể" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="specific">Khoảng thời gian cụ thể</SelectItem>
                <SelectItem value="always">Luôn luôn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="from-date">Từ ngày</Label>
              <DateRangePicker date={promotionDateRange} setDate={setPromotionDateRange} />
            </div>
            <div>
              <Label htmlFor="to-date">Đến ngày</Label>
              <DateRangePicker date={promotionDateRange} setDate={setPromotionDateRange} />
            </div>
            <div>
              <Label htmlFor="promotion-quantity">Số lượng khuyến mãi</Label>
              <Input id="promotion-quantity" type="number" defaultValue={0} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Khóa học đi kèm */}
      <Card>
        <CardHeader>
          <CardTitle>Khóa học đi kèm</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Thêm khóa học +</Button>
        </CardContent>
      </Card>

      {/* Khóa học đề xuất */}
      <Card>
        <CardHeader>
          <CardTitle>Khóa học đề xuất</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Thêm khóa học +</Button>
        </CardContent>
      </Card>

      {/* Sách đề xuất */}
      <Card>
        <CardHeader>
          <CardTitle>Sách đề xuất</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Thêm sách +</Button>
        </CardContent>
      </Card>

      {/* Mô tả sản phẩm */}
      <Card>
        <CardHeader>
          <CardTitle>Mô tả sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-2 min-h-[150px] flex items-center justify-center text-muted-foreground">
            Rich Text Editor Placeholder
          </div>
        </CardContent>
      </Card>

      {/* Nội dung */}
      <Card>
        <CardHeader>
          <CardTitle>Nội dung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-2 min-h-[150px] flex items-center justify-center text-muted-foreground">
            Rich Text Editor Placeholder
          </div>
        </CardContent>
      </Card>

      {/* NEW: Book-specific cards placed under "Nội dung" */}
      <Card>
        <CardHeader>
          <CardTitle>Điểm nổi bật của sách</CardTitle>
        </CardHeader>
        <CardContent>
          <BookHighlights />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tài nguyên / Sách kèm theo</CardTitle>
        </CardHeader>
        <CardContent>
          <BookIncludes />
        </CardContent>
      </Card>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">TẠO MỚI</Button>
      </div>
    </div>
  );
};

export default AddBookForm;