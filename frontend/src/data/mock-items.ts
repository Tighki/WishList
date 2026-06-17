import type { WishlistItem } from '@/types/wishlist'

export const mockItems: WishlistItem[] = [
  {
    id: '1',
    url: 'https://www.ozon.ru/product/example-1',
    title: 'Смеситель для кухни однорычажный',
    description: 'Хром, поворотный излив 360°, керамический картридж',
    price: 4290,
    quantity: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    url: 'https://www.ozon.ru/product/example-2',
    title: 'Ламинат дуб натуральный 33 класс',
    description: '8 мм, влагостойкий, упаковка 2.131 м²',
    price: 1899,
    quantity: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    url: 'https://www.ozon.ru/product/example-3',
    title: 'Светильник потолочный LED 36W',
    description: 'Тёплый белый 3000K, пульт ДУ, диммирование',
    price: 3150,
    quantity: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
  },
]
