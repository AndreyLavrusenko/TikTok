import React from 'react';
import {footerList1, footerList2, footerList3} from '../utils/constants';


type ListProps = {
    footerList: string[],
    mt: boolean,
}

const List = ({footerList, mt}: ListProps) => (
    <div className={`flex flex-wrap gap-2 ${mt && 'mt-5'}`}>
        {footerList.map(item => (
            <p key={item} className="text-gray-400 text-sm hover:underline cursor-pointer">
                {item}
            </p>
        ))}
    </div>
)

const Footer = () => {
    return (
        <div className={"mt-6 hidden xl:block"}>
            <List footerList={footerList1} mt={false}/>
            <List footerList={footerList2} mt/>
            <List footerList={footerList3} mt/>
            <p className="text-gray-400 text-sm mt-5">2023 TikTok</p>
        </div>
    );
};

export default Footer;