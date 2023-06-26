console.log('lucas           Costa'.toLowerCase().includes('lu'.toLowerCase()));
console.log('luc  as Costa            '.toLowerCase().includes('Lu'.toLowerCase()))
console.log('lu cas Co s ta'.toLowerCase().trim().includes('Lucas'.toLowerCase()))
console.log('lucas Costa'.toLowerCase().includes('Lucas costa'.toLowerCase()))
console.log('lucas Costa'.toLowerCase().includes('Lucas C'.toLowerCase()))

const strDefault = 'lu cas Co s ta';
const str = strDefault.replace(/\s/g, '');
console.log(str)
// AO INVES DE TRIM USAR ISSO