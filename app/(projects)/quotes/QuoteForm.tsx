"use client";
import { FC, PropsWithChildren, DOMAttributes, useState, ChangeEvent, FormEvent } from "react";
import { BaseInput, BaseTextarea } from "@shuriken-ui/react";
import { useEntity, useEntityDispatch } from "./context";
import { useCloseModal } from "@/lib/client/hooks/useCloseModal";
import { Quote } from "./constants";
import { useNavigate } from "react-router-dom";

export const QuoteForm: FC<PropsWithChildren> = ({ children }) => {
    const { currentEntity, entityList, currentCollection } = useEntity();
    const dispatch = useEntityDispatch();
    const navigate = useNavigate();
    const close = useCloseModal();

    const [formData, setFormData] = useState({
        quote: currentEntity?.quote || '',
        translation: currentEntity?.translation || '',
        wordlist: currentEntity?.wordlist || '',
        artwork: currentEntity?.artwork || '',
        image: currentEntity?.image || ''
    });

    const handleChange = (name: string) => (valueOrEvent: string | number | FormEvent<HTMLInputElement>) => {
        const value = typeof valueOrEvent === 'object' ? (valueOrEvent.target as HTMLInputElement).value : valueOrEvent;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = (e) => {
        e.preventDefault();

        const quote = {
            ...currentEntity,
            id: currentEntity?.id || Date.now(),
            ...formData
        };

        const targetItemIndex = entityList?.findIndex(
            (e) => e.id === currentEntity.id
        );
        const isEditing = targetItemIndex !== undefined && targetItemIndex !== -1;

        dispatch({
            type: "CREATE_OR_UPDATE_ENTITY",
            payload: quote,
        });

        if (!isEditing) {
            navigate(`/${currentCollection!.id}/` + quote.id, {
                replace: true,
                state: { __NA: {} },
            });
        }

        setTimeout(() => {
            dispatch({
                type: "SET_ENTITY_MODAL_MODE",
                payload: "view",
            });
        }, 100);
    };

    return (
        <form method="POST" onSubmit={handleSubmit}>
            <div className="ltablet:col-span-6 col-span-12 md:col-span-12">
                <div className="relative w-full bg-white transition-all duration-300 rounded-md">
                    <div className="p-4 md:p-8">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12">
                                <BaseTextarea
                                    rows={6}
                                    label="引用原文"
                                    size="sm"
                                    id="quote"
                                    value={formData.quote}
                                    onChange={handleChange('quote')}
                                    placeholder="请输入原文引用"
                                />
                            </div>

                            <div className="col-span-12">
                                <BaseTextarea
                                    rows={6}
                                    label="翻译"
                                    size="sm"
                                    id="translation"
                                    value={formData.translation}
                                    onChange={handleChange('translation')}
                                    placeholder="请输入翻译"
                                />
                            </div>

                            <div className="col-span-12">
                                <BaseTextarea
                                    rows={8}
                                    label="生词表"
                                    size="sm"
                                    id="wordlist"
                                    name="wordlist"
                                    value={formData.wordlist}
                                    onChange={handleChange('wordlist')}
                                    placeholder="请输入生词"
                                />
                            </div>

                            <div className="col-span-12">
                                <BaseInput
                                    label="作品名"
                                    size="sm"
                                    id="artwork"
                                    value={formData.artwork}
                                    onChange={handleChange('artwork')}
                                    placeholder="请输入作品名"
                                />
                            </div>

                            <div className="col-span-12">
                                <BaseInput
                                    label="图片链接"
                                    labelFloat
                                    size="sm"
                                    id="image"
                                    value={formData.image}
                                    onChange={handleChange('image')}
                                    placeholder="请输入图片链接"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </form>
    );
}; 