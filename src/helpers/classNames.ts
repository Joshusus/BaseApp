export default function classNames(...classes: string[]) 
{ 
  return classes.filter(c => Boolean(c)).join(' '); 
}