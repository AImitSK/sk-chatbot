import React from 'react';

interface StatProps {
    title: string;
    value: string | number;
    change: string | number;
}

const Stat: React.FC<StatProps> = ({ title, value, change }) => {
    return (
        <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
            <small className="text-gray-500">{change}</small>
        </div>
    );
};

export default Stat;