import React, { useState } from 'react';

import { Skeleton } from 'antd';
import { useLocation } from 'react-router-dom';

import Plans from '../components/Plans';
import useEmailDomainPlansApi from '../hooks/useEmailDomainPlansApi';
import useForm from '../hooks/useForm';
import { productComponents } from '../utils/products';

const DetailsPage = () => {
    const { productId } = useLocation().state;
    const [selectedType, setSelectedType] = useState('Monthly');
    const { plansData, productData, isLoading } = useEmailDomainPlansApi(productId);
    const [formData, setFormData] = useState<any>({});
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const { handleSubmission } = useForm();
    const handleChange = (tab: string) => {
        setSelectedType(tab);
    };
    const handlePurchase = ({ amount, planId }: { amount: string; planId: number }) => {
        handleSubmission({ amount, formData, planId, selectedType });
    };

    return (
        <>
            {isLoading ? (
                <Skeleton active />
            ) : (
                <>
                    {productData?.peko_key &&
                    productComponents[productData.peko_key as keyof typeof productComponents]
                        ? React.createElement(
                              productComponents[
                                  productData.peko_key as keyof typeof productComponents
                              ],
                              {
                                  setFormData,
                                  formData,
                                  setIsFormSubmitted,
                                  productData,
                              }
                          )
                        : React.createElement(productComponents.default, {
                              setFormData,
                              formData,
                              setIsFormSubmitted,
                              productData,
                          })}
                </>
            )}
            {isFormSubmitted && (
                <Plans
                    isLoading={isLoading}
                    plansData={plansData}
                    selectedType={selectedType}
                    handleChange={handleChange}
                    isFormSubmitted={isFormSubmitted}
                    handlePurchase={handlePurchase}
                />
            )}
        </>
    );
};

export default DetailsPage;
