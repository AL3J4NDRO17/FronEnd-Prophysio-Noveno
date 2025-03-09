import { useState, useEffect } from "react";
import { getFaqs, createFaq, updateFaq as updateFaqService, deleteFaq as deleteFaqService } from "../services/faqService";

const useFaqs = (companyId) => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!companyId) return;

        const fetchFaqs = async () => {
            try {
                const data = await getFaqs(companyId);
                setFaqs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, [companyId]);

    const addFaq = async (newFaq) => {
        try {
            const savedFaq = await createFaq(newFaq);
            setFaqs([...faqs, savedFaq]);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateFaq = async (id, updatedFaq) => {
        try {
            const updated = await updateFaqService(id, updatedFaq);
            setFaqs(faqs.map((faq) => (faq.faq_id === id ? updated : faq)));
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteFaq = async (id) => {
        try {
            await deleteFaqService(id);
            setFaqs(faqs.filter((faq) => faq.faq_id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return { faqs, loading, error, addFaq, updateFaq, deleteFaq };
};

export default useFaqs;