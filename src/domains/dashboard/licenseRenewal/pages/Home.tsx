import { Flex } from 'antd';

import VoucherIdForm from '../components/forms/VoucherIdForm';
import Header from '../components/Header';
import Hero from '../components/Hero';

const Home = () => (
    <Flex vertical className="px-0">
        <Header />
        <Hero />
        <VoucherIdForm />
    </Flex>
);

export default Home;
