export const initializeCategories = () => [
  { id: 'cat-1', name: 'Superesportivos' },
  { id: 'cat-2', name: 'Clássicos' },
  { id: 'cat-3', name: 'Muscle Cars' },
  { id: 'cat-4', name: 'JDM (Japoneses)' },
  { id: 'cat-5', name: 'Utilitários' },
];

export const initializeMiniatures = () => {
  return [
    {
      id: '1',
      name: 'Ferrari F40 1987',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
      price: 299.90,
      scale: '1:18',
      stock: 5,
      categoryId: 'cat-1'
    },
    {
      id: '2',
      name: 'Porsche 911 Turbo',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
      price: 279.90,
      scale: '1:18',
      stock: 3,
      categoryId: 'cat-1'
    },
    {
      id: '3',
      name: 'Lamborghini Countach',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
      price: 349.90,
      scale: '1:18',
      stock: 2,
      categoryId: 'cat-1'
    },
    {
      id: '4',
      name: 'Mercedes-Benz 300SL',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      price: 389.90,
      scale: '1:18',
      stock: 4,
      categoryId: 'cat-2'
    },
    {
      id: '5',
      name: 'Ford Mustang 1967',
      image: 'https://images.unsplash.com/photo-1584345604476-8ec5f6171d92?w=800&h=600&fit=crop',
      price: 259.90,
      scale: '1:18',
      stock: 0,
      categoryId: 'cat-3'
    },
    {
      id: '6',
      name: 'Chevrolet Corvette C2',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      price: 269.90,
      scale: '1:18',
      stock: 6,
      categoryId: 'cat-2'
    },
    {
      id: '7',
      name: 'Aston Martin DB5',
      image: 'https://images.unsplash.com/photo-1606016159991-73ccf43ebc97?w=800&h=600&fit=crop',
      price: 399.90,
      scale: '1:18',
      stock: 1,
      categoryId: 'cat-2'
    },
    {
      id: '8',
      name: 'BMW M3 E30',
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop',
      price: 239.90,
      scale: '1:18',
      stock: 7,
      categoryId: 'cat-2'
    },
    {
      id: '9',
      name: 'Nissan Skyline GT-R R34',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
      price: 289.90,
      scale: '1:18',
      stock: 0,
      categoryId: 'cat-4'
    },
    {
      id: '10',
      name: 'Toyota Supra MK4',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      price: 279.90,
      scale: '1:18',
      stock: 4,
      categoryId: 'cat-4'
    },
    {
      id: '11',
      name: 'Dodge Charger 1970',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
      price: 249.90,
      scale: '1:18',
      stock: 5,
      categoryId: 'cat-3'
    },
    {
      id: '12',
      name: 'Volkswagen Kombi 1975',
      image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800&h=600&fit=crop',
      price: 189.90,
      scale: '1:18',
      stock: 8,
      categoryId: 'cat-5'
    }
  ];
};