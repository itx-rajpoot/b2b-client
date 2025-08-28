export const sizesOptions = [
  { value: 'xs', label: 'Extra small' },
  { value: 's', label: 'Small' },
  { value: 'm', label: 'Medium' },
  { value: 'l', label: 'Large' },
  { value: 'xl', label: 'Extra large' },
];

export const getSize = (value) => sizesOptions.find(x => x.value === value)?.label || value;

export const addonsOptions = [
  { value: 'Ketchup', label: 'Ketchup' },
  { value: 'Mayonnaise', label: 'Mayonnaise' },
  { value: 'Chilli sauce', label: 'Chilli sauce' },
  { value: 'Fried onions', label: 'Fried onions' },
  { value: 'French fries', label: 'French fries' },
  { value: 'BBQ', label: 'BBQ' },
];
export const sidesOptions = [];
