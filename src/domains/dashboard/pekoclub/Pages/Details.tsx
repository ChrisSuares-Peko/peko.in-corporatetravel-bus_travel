import React from 'react';

import { Col, Flex, Image, Row, Tag, Typography } from 'antd';

import news from '../assets/news.png';

const Details = () => (
    <>
        <Row>
            <Col span={24}>
                <Image src={news} width="100%" height="100%" />
            </Col>
        </Row>
        <Flex vertical>
            <Typography.Text className="text-3xl  mt-8">
                Ministry of Industry & Advanced Technology and Abu Dhabi Chamber highlight the
                catalysts of industrial growth
            </Typography.Text>
            <Flex className="mt-4">
                <Tag color="#EDEDED" className="w-36 h-6">
                    <Typography.Text className="text-black">Abu Dhabi Chamber</Typography.Text>
                </Tag>
                <Tag color="#EDEDED" className="w-36 h-6">
                    <Typography.Text className="text-black">14 June 2023</Typography.Text>
                </Tag>
            </Flex>
            <Typography.Paragraph className="mt-8 text-base font-roboto">
                The meeting aligns with the objectives of establishing the working groups, which
                include strengthening the mutual partnership between the private sector and the
                government sector, in order to strengthen trade and commerce in the Emirate of Abu
                Dhabi. The working groups aim to address the private sector’s challenges and bring
                them to the attention of authorities in the UAE and abroad. They also aim to study
                the private sector’s projects, and provide opinions, proposals, and advice to its
                members and the concerned authorities across a range of areas, among other goals, as
                per Law No. 27 of 2005 concerning the Reorganisation of the Abu Dhabi Chamber, and
                its amendments in Law No. 19 of 2018.
                <br />
                <br />
                The meeting, which was chaired by His Excellency Abdulla Mohamed Al Mazrui, Chairman
                of the Abu Dhabi Chamber, addressed the latest developments and achievements, the
                current challenges across various sectors and ways to overcome them effectively, as
                well as opportunities of collaboration with the concerned parties to find the right
                solutions.
                <br />
                <br />
                His Excellency Al Mazrui said: “Since its establishment, the Abu Dhabi Chamber has
                sought to support Abu Dhabi’s private sector across a range of sectors. The Chamber
                ensures frequent and effective communication with the private sector to drive the
                sector’s success in a competitive business environment. The Chamber also aims to
                encourage dialogue and consultation with decision-makers to discuss developments
                relevant to the business community. As such, we manage the sectoral working groups
                as part of our role as a policy advocator, to provide the private sector with the
                opportunity to pass on their views to the legislative authorities regarding issues
                that impact business development and continuity, and contribute to the formulation
                of relevant policies.”
                <br />
                <br />
                His Excellency added: “The Chamber is committed to carrying out its tasks and duties
                to support the private sector in realising its potential. This comes in line with
                the Chamber’s strategic objectives.”
                <br />
                The meeting was attended by Karl Magnus Olsson, Board Member and Chairman of
                Transformation Committee at the Abu Dhabi Chamber, and Chairs of the Chamber’s
                working groups, including: Ahmad Rahma Al Masaood, Chairman of the Automotive
                Agencies and Importers of Spare Parts Working Group; Otaiba Saeed Al Otaiba,
                Chairman of the Working Cities Working Group; Rasheed Mikati, Board Member and
                Chairman of the Construction Working Group; Amer Kakish, Board Member and Chairman
                of the Industry Working Group; Khaled Abdel Karim Al Fahim, Board Member and
                Chairman of the Healthcare Working Group, and Mounir Haidar, Chairman of the Real
                Estate Working Group.
            </Typography.Paragraph>
        </Flex>
    </>
);

export default Details;
