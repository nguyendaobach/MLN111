// Knowledge Base System for AI Chatbot
// Implements RAG (Retrieval-Augmented Generation) functionality

class KnowledgeBase {
    constructor() {
        this.documents = new Map(); 
        this.embeddings = new Map();
        this.index = null; 
        this.isInitialized = false;
        

        this.initDefaultKnowledge();
    }

    // Khởi tạo dữ liệu mẫu 
    initDefaultKnowledge() {
        const defaultDocs = [
            {
                id: 'doc1',
                title: 'Học thuyết hình thái kinh tế-xã hội',
                content: 'Học thuyết hình thái kinh tế-xã hội của Marx giải thích cấu trúc và sự vận động của xã hội. Bao gồm: Lực lượng sản xuất (LVSX) - người lao động, tay nghề, tư liệu sản xuất, công nghệ; Quan hệ sản xuất (QHSX) - mối quan hệ xã hội về sở hữu, phân phối; Kiến trúc thượng tầng (KTTT) - chính trị, pháp luật, ý thức xã hội. HTKTXH là trạng thái đồng nhất của LVSX, QHSX và KTTT trong giai đoạn lịch sử.',
                category: 'Triết học Marx-Lenin',
                tags: ['marx', 'hình thái kinh tế xã hội', 'lực lượng sản xuất', 'quan hệ sản xuất', 'kiến trúc thượng tầng']
            },
            {
                id: 'doc2', 
                title: 'Mâu thuẫn giữa LVSX và QHSX',
                content: 'Mâu thuẫn cơ bản của xã hội: LVSX luôn phát triển (cải tiến kỹ thuật, tăng năng suất) trong khi QHSX là khuôn khổ xã hội tương đối ổn định. Khi LVSX vượt ra khỏi QHSX cũ, nảy sinh mâu thuẫn dẫn đến biến đổi xã hội. Mâu thuẫn biểu hiện qua khủng hoảng kinh tế, bất công xã hội, xung đột chính trị. Giải quyết mâu thuẫn thông qua cải cách hoặc cách mạng.',
                category: 'Triết học Marx-Lenin',
                tags: ['mâu thuẫn', 'lực lượng sản xuất', 'quan hệ sản xuất', 'biến đổi xã hội', 'khủng hoảng']
            },
            {
                id: 'doc3',
                title: 'Đấu tranh giai cấp',
                content: 'Đấu tranh giai cấp là động lực trực tiếp của sự thay đổi xã hội. Khi mâu thuẫn LVSX-QHSX trở nên gay gắt, các giai cấp có lợi ích đối lập sẽ đấu tranh. Giai cấp đại diện cho LVSX mới đứng lên lật đổ giai cấp cũ. Hình thức: biểu tình, đình công, cách mạng. Kết quả: xóa bỏ QHSX lỗi thời, thiết lập QHSX mới phù hợp. Lịch sử: từ cộng sản nguyên thủy → nô lệ → phong kiến → tư bản → xã hội chủ nghĩa.',
                category: 'Triết học Marx-Lenin',
                tags: ['đấu tranh giai cấp', 'cách mạng', 'động lực xã hội', 'lịch sử', 'giai cấp']
            },
            {
                id: 'doc4',
                title: 'Biện chứng cơ sở hạ tầng - kiến trúc thượng tầng',
                content: 'Mối quan hệ biện chứng: Cơ sở hạ tầng (QHSX) quyết định kiến trúc thượng tầng (chính trị, pháp luật, ý thức). KTTT có tính độc lập tương đối, tác động ngược lại có thể thúc đẩy hoặc kìm hãm LVSX. Ví dụ: kinh tế tư bản → nhà nước pháp quyền; kinh tế phong kiến → chế độ quân chủ. KTTT có thể bảo tồn QHSX cũ (kìm hãm) hoặc hỗ trợ LVSX mới (thúc đẩy).',
                category: 'Triết học Marx-Lenin',
                tags: ['biện chứng', 'cơ sở hạ tầng', 'kiến trúc thượng tầng', 'tác động ngược', 'quyết định']
            },
            {
                id: 'doc5',
                title: 'Quy luật vận động xã hội',
                content: 'Xã hội không bao giờ đứng yên vì: 1) LVSX phát triển không ngừng - con người luôn sáng tạo công cụ, công nghệ mới; 2) Tạo mâu thuẫn với QHSX cũ khi không còn phù hợp; 3) Dẫn đến đấu tranh giai cấp; 4) Thay đổi KTTT. Chu kỳ: phát triển → mâu thuẫn → đấu tranh → biến đổi → ổn định tạm thời → phát triển tiếp. Đây là quy luật khách quan của lịch sử nhân loại.',
                category: 'Triết học Marx-Lenin',
                tags: ['quy luật', 'vận động xã hội', 'phát triển', 'chu kỳ lịch sử', 'khách quan']
            },
            {
                id: 'doc6',
                title: 'Cách mạng từ phong kiến sang tư bản',
                content: 'Minh chứng lịch sử: Châu Âu thế kỷ 18-19. LVSX mới: thương nghiệp, công nghiệp, máy móc thay thế thủ công. Mâu thuẫn: chế độ phong kiến (sở hữu ruộng đất, nông nô) kìm hãm sản xuất hàng hóa. Đấu tranh: giai cấp tư sản đứng lên đòi quyền tự do kinh doanh, dân chủ chính trị. Kết quả: cách mạng tư sản (Anh, Pháp), thiết lập nhà nước pháp quyền, quan hệ tiền lương thay thế quan hệ nông nô.',
                category: 'Lịch sử ứng dụng',
                tags: ['cách mạng tư sản', 'phong kiến', 'tư bản chủ nghĩa', 'châu âu', 'lịch sử']
            },
            {
                id: 'doc7',
                title: 'Cách mạng Tháng Mười Nga 1917',
                content: 'Ví dụ "bước nhảy" trong lịch sử. Bối cảnh: Nga nửa phong kiến, nửa tư bản; khủng hoảng do chiến tranh. Mâu thuẫn: nông dân, công nhân đối lập với chính quyền Nga hoàng. LVSX: công nghiệp mới nhưng QHSX lạc hậu. Đấu tranh: Đảng Bolshevik lãnh đạo cách mạng. Kết quả: thành lập nhà nước xã hội chủ nghĩa đầu tiên, minh họa cho thay đổi đột ngột khi mâu thuẫn tích tụ quá giới hạn.',
                category: 'Lịch sử ứng dụng',
                tags: ['cách mạng tháng mười', 'nga', 'bolshevik', 'xã hội chủ nghĩa', 'lenin']
            },
            {
                id: 'doc8',
                title: 'Mâu thuẫn thời đại số',
                content: 'Ứng dụng hiện đại: LVSX mới - AI, tự động hóa, kinh tế số, nền tảng dữ liệu. QHSX cũ - luật lao động truyền thống, mô hình doanh nghiệp cũ. Mâu thuẫn: tự động hóa giảm việc làm, tập trung quyền lực vào big tech, bất bình đẳng số. Biểu hiện: phong trào đòi quyền lao động nền tảng, thuế big tech, lương cơ bản. Đây là minh chứng đương đại cho quy luật Marx về sự vận động không ngừng của xã hội.',
                category: 'Ứng dụng hiện đại',
                tags: ['kinh tế số', 'AI', 'tự động hóa', 'big tech', 'lao động nền tảng', 'hiện đại']
            }
        ];

        defaultDocs.forEach(doc => {
            this.addDocument(doc);
        });
    }

    // Thêm document vào knowledge base
    addDocument(doc) {
        if (!doc.id || !doc.content) {
            throw new Error('Document must have id and content');
        }

        const document = {
            id: doc.id,
            title: doc.title || '',
            content: doc.content,
            category: doc.category || 'General',
            tags: doc.tags || [],
            timestamp: new Date().toISOString(),
            embedding: null 
        };

        this.documents.set(doc.id, document);
        

        this.computeEmbedding(document);
        
        console.log(`Added document: ${doc.title || doc.id}`);
        return document;
    }

  
    computeEmbedding(document) {
        const text = (document.title + ' ' + document.content + ' ' + document.tags.join(' ')).toLowerCase();
        const words = text.split(/\s+/).filter(word => word.length > 2);
        
        // Tạo word frequency vector
        const wordFreq = {};
        words.forEach(word => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });

        document.embedding = wordFreq;
        this.embeddings.set(document.id, wordFreq);
    }

    // Tìm kiếm semantic documents dựa trên query
    searchRelevantDocuments(query, limit = 3) {
        if (!query || this.documents.size === 0) {
            return [];
        }

        const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
        const queryFreq = {};
        queryWords.forEach(word => {
            queryFreq[word] = (queryFreq[word] || 0) + 1;
        });

        const scores = [];

        // Tính similarity score cho mỗi document
        for (const [docId, embedding] of this.embeddings.entries()) {
            const score = this.cosineSimilarity(queryFreq, embedding);
            if (score > 0) {
                scores.push({
                    document: this.documents.get(docId),
                    score: score
                });
            }
        }

        // Sắp xếp theo score trả về top results
        return scores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.document);
    }

    // Tính cosine similarity giữa hai vectors
    cosineSimilarity(vec1, vec2) {
        const words1 = new Set(Object.keys(vec1));
        const words2 = new Set(Object.keys(vec2));
        const commonWords = new Set([...words1].filter(x => words2.has(x)));

        if (commonWords.size === 0) return 0;

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        // Tính dot product và norms
        for (const word of commonWords) {
            dotProduct += vec1[word] * vec2[word];
        }

        for (const word of words1) {
            norm1 += vec1[word] * vec1[word];
        }

        for (const word of words2) {
            norm2 += vec2[word] * vec2[word];
        }

        norm1 = Math.sqrt(norm1);
        norm2 = Math.sqrt(norm2);

        if (norm1 === 0 || norm2 === 0) return 0;

        return dotProduct / (norm1 * norm2);
    }

    // Tạo context cho prompt injection
    createContextForPrompt(relevantDocs) {
        if (!relevantDocs || relevantDocs.length === 0) {
            return '';
        }

        let context = '\n--- KNOWLEDGE BASE CONTEXT ---\n';
        context += 'Dưới đây là thông tin từ knowledge base có thể hữu ích để trả lời câu hỏi:\n\n';

        relevantDocs.forEach((doc, index) => {
            context += `${index + 1}. **${doc.title}** (${doc.category})\n`;
            context += `${doc.content}\n`;
            if (doc.tags.length > 0) {
                context += `Tags: ${doc.tags.join(', ')}\n`;
            }
            context += '\n';
        });

        context += '--- END KNOWLEDGE BASE CONTEXT ---\n\n';
        context += 'Vui lòng sử dụng thông tin trên để cung cấp câu trả lời chính xác và chi tiết. Nếu thông tin trong knowledge base không đủ để trả lời, hãy nói rõ và đưa ra câu trả lời tốt nhất có thể.\n\n';

        return context;
    }

    // Lấy tất cả documents
    getAllDocuments() {
        return Array.from(this.documents.values());
    }

    // Xóa document
    removeDocument(docId) {
        if (this.documents.has(docId)) {
            this.documents.delete(docId);
            this.embeddings.delete(docId);
            console.log(`Removed document: ${docId}`);
            return true;
        }
        return false;
    }

    // Tìm kiếm documents theo keyword
    searchByKeyword(keyword) {
        const results = [];
        const searchTerm = keyword.toLowerCase();

        for (const doc of this.documents.values()) {
            const searchText = (doc.title + ' ' + doc.content + ' ' + doc.tags.join(' ')).toLowerCase();
            if (searchText.includes(searchTerm)) {
                results.push(doc);
            }
        }

        return results;
    }

    // Import documents từ JSON
    importDocuments(documentsJson) {
        try {
            const docs = JSON.parse(documentsJson);
            let imported = 0;

            docs.forEach(doc => {
                try {
                    this.addDocument(doc);
                    imported++;
                } catch (error) {
                    console.error(`Failed to import document ${doc.id}:`, error);
                }
            });

            return { success: true, imported: imported, total: docs.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Export documents to JSON
    exportDocuments() {
        const docs = Array.from(this.documents.values()).map(doc => ({
            id: doc.id,
            title: doc.title,
            content: doc.content,
            category: doc.category,
            tags: doc.tags
        }));

        return JSON.stringify(docs, null, 2);
    }

    // Get statistics
    getStats() {
        const categories = {};
        const tags = {};

        for (const doc of this.documents.values()) {
            // Count categories
            categories[doc.category] = (categories[doc.category] || 0) + 1;
            
            // Count tags
            doc.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        }

        return {
            totalDocuments: this.documents.size,
            categories: categories,
            tags: tags
        };
    }
}

// Khởi tạo global knowledge base instance
window.knowledgeBase = new KnowledgeBase();

console.log('Knowledge Base System initialized!');
console.log('Available documents:', window.knowledgeBase.getAllDocuments().length);