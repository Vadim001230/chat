import { ReactComponent as Loader } from '../icons/loader.svg';
import './preloader.scss';

const Preloader = () => {
  return (
    <div className="preloader">
      <Loader />
    </div>
  );
};

export default Preloader;
