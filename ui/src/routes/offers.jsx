import ItemList from '../components/ItemList';
export default function Offers(props) {
  const { items } = props;
  return (
    <ItemList filter={(item) => item.offered} />
  )
}      
