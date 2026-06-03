import { Grid } from 'antd';
import { Content } from 'antd/es/layout/layout';

import RoomSelection from '../Components/ViewHotel/RoomSelection';
import ViewHotelsSm from '../Components/ViewHotel/ViewHotelsSm';

const { useBreakpoint } = Grid;
const HotelView = () => {
    const screens = useBreakpoint();
    return (
        <Content>
            {screens.md ? (
                // <HotelviewWeb />
                <RoomSelection />
            ) : (
                <ViewHotelsSm />
            )}
        </Content>
    );
};

export default HotelView;
