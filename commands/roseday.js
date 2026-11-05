 const settings = require('../settings');

async function rosedayCommand(sock, chatId, message) {
    try {
        // Array of 200+ Rose Day messages
        const roseMessages = [
            // Romantic Rose Messages
            "A red rose for the love that grows stronger each day. May our bond be as eternal as the fragrance of this rose. 🌹",
            "Just like every rose has its thorn, every relationship has its challenges. But it's worth it for the beauty we share. 🌹",
            "This rose represents my love for you - beautiful, timeless, and growing more precious each day. 🌹",
            "On this Rose Day, I offer you not just a flower, but my heart wrapped in petals of love. 🌹",
            "Like a rose needs sunlight, I need your love to blossom into the best version of myself. 🌹",
            "Every petal of this rose carries a wish for your happiness, a prayer for your well-being, and my endless love for you. 🌹",
            "This rose may wither someday, but my love for you will remain fresh and beautiful forever. 🌹",
            "You are the rose in the garden of my life, making everything around you beautiful. 🌹",
            "Just as a rose stands out in a garden, you stand out in my heart as the most special person. 🌹",
            "Sending you a bouquet of red roses, each representing a reason why I love you. 🌹",

            // Sweet & Caring
            "May this rose bring a smile to your face and remind you how special you are to me. 🌹",
            "Like morning dew on rose petals, may your life be filled with fresh blessings every day. 🌹",
            "This rose carries my warmest hugs and sweetest kisses to you. Happy Rose Day! 🌹",
            "You deserve all the roses in the world for being the amazing person you are. 🌹",
            "Just as roses need care to bloom, our relationship needs love to flourish. And I promise to always nurture it. 🌹",
            "Sending you a virtual rose that will never wither, just like my love for you. 🌹",
            "May the fragrance of this rose fill your life with happiness and your heart with joy. 🌹",
            "You are more beautiful than the most perfect rose in the world. 🌹",
            "This rose is a small token of my big love for you. Happy Rose Day, my love! 🌹",
            "Like a rose garden in full bloom, may your life be colorful and fragrant. 🌹",

            // Poetic Rose Messages
            "Roses are red, violets are blue, my love for you is forever true. 🌹",
            "In the garden of life, you're the rarest rose that makes everything beautiful. 🌹",
            "The rose speaks of love silently, in a language known only to the heart. 🌹",
            "Like a rose that blooms despite the thorns, our love grows despite all challenges. 🌹",
            "A single rose can be my garden, a single friend my world, and you my everything. 🌹",
            "The rose is the flower of love - I offer you this and my heart. 🌹",
            "As the rose is the pride of the garden, so are you the pride of my life. 🌹",
            "Roses don't rush to bloom, and true love doesn't rush to happen. It grows beautifully in its own time. 🌹",
            "The beauty of a rose lasts but a day, but the beauty of our love will last forever. 🌹",
            "Like a rose that shares its fragrance with all, share your love and light with the world. 🌹",

            // Friendship Roses
            "A yellow rose for our friendship - bright, cheerful, and full of sunshine. 💛🌹",
            "Our friendship is like a rose - beautiful, strong, and worth protecting. 🌹",
            "Sending you a rose to thank you for being such a wonderful friend. 🌹",
            "Just like every rose is unique, our friendship is one of a kind. 🌹",
            "This rose represents the beauty of our friendship that grows more precious with time. 🌹",
            "A friend is like a rose - they bring color and fragrance to your life. 🌹",
            "Thank you for being the rose in the garden of my friendships. 🌹",
            "Our friendship doesn't need special days, but today I want to celebrate it with this rose. 🌹",
            "Like a rose that blooms in different colors, our friendship has many beautiful shades. 🌹",
            "This rose is for you, my friend, for all the times you've been there for me. 🌹",

            // Family Love
            "A pink rose for my family - representing gratitude and appreciation for all you do. 💗🌹",
            "Family is like a rose bush - we may have our thorns, but together we create something beautiful. 🌹",
            "This rose is for my wonderful family - the foundation of my life and source of my strength. 🌹",
            "Like a rose that needs care to bloom, our family needs love to stay strong. 🌹",
            "Sending roses to the most important people in my life - my family. 🌹",
            "You are the rose in our family garden, making everything more beautiful. 🌹",
            "Family love is like a rose - it may have prickles, but its beauty makes it all worthwhile. 🌹",
            "This rose carries my love and respect for everything you do for our family. 🌹",
            "Like different colored roses in a bouquet, each family member adds their unique beauty. 🌹",
            "Our family bond is stronger than any thorn and more beautiful than any rose. 🌹",

            // Inspirational Rose Messages
            "Be like a rose - beautiful inside and out, strong enough to handle thorns, and generous enough to share your fragrance. 🌹",
            "Life is like a rose - it has both petals and thorns. Learn to appreciate both. 🌹",
            "Just as a rose doesn't compare itself to other flowers, don't compare your journey to others. Bloom in your own time. 🌹",
            "The most beautiful roses often grow from the most challenging conditions. Keep growing! 🌹",
            "Like a rose that turns toward the sun, always turn toward positivity and light. 🌹",
            "Every rose was once a bud - remember that every great thing starts small. 🌹",
            "Be the rose in someone's life - bring beauty, fragrance, and joy wherever you go. 🌹",
            "The rose's journey from bud to bloom teaches us about patience and beautiful transformations. 🌹",
            "Even the most beautiful rose has thorns - perfection isn't about having no flaws, but about being beautiful despite them. 🌹",
            "Like a rose that shares its beauty with all, share your gifts with the world. 🌹",

            // Romantic Deep Love
            "You are the red rose in the garden of my heart, the most beautiful and precious of all. 🌹",
            "My love for you is like a rose - it grows more beautiful with each passing day. 🌹",
            "Just as a rose needs water to thrive, I need your love to feel alive. 🌹",
            "This rose represents the countless ways you make my life beautiful. 🌹",
            "You are the reason my heart blooms like a rose in spring. 🌹",
            "Like a rose that captures everyone's attention, you captured my heart completely. 🌹",
            "My love, you are more precious to me than the rarest rose in the world. 🌹",
            "This rose carries all the love my heart holds for you - endless and unconditional. 🌹",
            "Just as roses come in different colors, my love for you has many beautiful shades. 🌹",
            "You are the rose I never knew I needed until I found you. 🌹",

            // Rose Color Meanings
            "Red rose for passionate love that burns eternally in my heart for you. ❤️🌹",
            "Pink rose for admiration and gratitude for having you in my life. 💗🌹",
            "White rose for pure love and new beginnings we share together. 🤍🌹",
            "Yellow rose for the friendship that forms the foundation of our relationship. 💛🌹",
            "Orange rose for the enthusiasm and energy you bring into my life. 🧡🌹",
            "Lavender rose for the enchantment and love at first sight I experienced. 💜🌹",
            "Coral rose for the desire and excitement I feel when I'm with you. 🧡🌹",
            "Peach rose for the sincerity and gratitude I feel toward you. 🍑🌹",
            "Blue rose for the mystery and uniqueness of our extraordinary love. 💙🌹",
            "Rainbow roses for all the colorful emotions you bring into my life. 🌈🌹",

            // Spiritual Rose Messages
            "Like a rose that blooms toward heaven, may your spirit always reach for higher things. 🌹",
            "The rose reminds us that even the most beautiful things have their challenges - and that's what makes them strong. 🌹",
            "May your life be like a rose - beautiful, fragrant, and blessed from above. 🌹",
            "The rose teaches us that true beauty comes from within and radiates outward. 🌹",
            "Like a rose that turns its face to the sun, turn your heart to God's love. 🌹",
            "The fragrance of a rose is like prayer - it rises upward and touches the divine. 🌹",
            "May your faith be as strong as a rose stem and your heart as beautiful as its petals. 🌹",
            "The rose is God's way of showing us that beauty can grow even in difficult places. 🌹",
            "Like different roses in a garden, we are all unique creations of God. 🌹",
            "The rose doesn't strive to be beautiful - it just is. Be your beautiful self. 🌹",

            // Rose Day Wishes
            "Happy Rose Day! May your life be as beautiful and fragrant as a rose garden. 🌹",
            "Wishing you a Rose Day filled with love, happiness, and beautiful moments. 🌹",
            "On this special day, I wish you all the love and happiness that a rose represents. 🌹",
            "May this Rose Day bring new beginnings and beautiful relationships into your life. 🌹",
            "Sending you rose-scented wishes for a wonderful Rose Day celebration. 🌹",
            "Happy Rose Day! May your relationships bloom like beautiful roses. 🌹",
            "Wishing you a Rose Day as special and beautiful as you are. 🌹",
            "May the spirit of Rose Day fill your heart with love and joy. 🌹",
            "Happy Rose Day! May you receive all the love you deserve. 🌹",
            "Wishing you a Rose Day that marks the beginning of beautiful relationships. 🌹",

            // Long Distance Love
            "Though miles separate us, this virtual rose carries all my love to you. Happy Rose Day! 🌹",
            "Distance means so little when someone means so much. This rose carries my love across the miles. 🌹",
            "No distance can diminish the fragrance of my love for you. Happy Rose Day, my love! 🌹",
            "This rose may be virtual, but my love for you is very real. Missing you especially today. 🌹",
            "Across the miles, I send you this rose and all my love. Can't wait to be with you. 🌹",
            "The distance between us is nothing compared to the love in my heart for you. Happy Rose Day! 🌹",
            "Though we're apart, you're always in my heart. Sending you roses and love. 🌹",
            "This rose represents my promise that no distance can keep us apart. 🌹",
            "Miles can't separate hearts that are connected by love. Happy Rose Day! 🌹",
            "Thinking of you and sending virtual roses until I can give you real ones. 🌹",

            // Proposal & Commitment
            "This rose is a promise - a promise to love you today, tomorrow, and forever. 🌹",
            "Like this rose, I offer you my heart - handle it with care and it will bloom beautifully. 🌹",
            "Will you accept this rose and my heart along with it? 🌹",
            "This rose represents the beginning of our beautiful journey together. 🌹",
            "I give you this rose as a symbol of my commitment to our relationship. 🌹",
            "Like a rose that blooms year after year, my love for you will last forever. 🌹",
            "This rose carries my promise to always cherish and protect our love. 🌹",
            "Accept this rose as a token of my sincere love and devotion to you. 🌹",
            "Just as I carefully chose this perfect rose, I choose you every day. 🌹",
            "This rose is my way of saying I want to grow old with you. 🌹",

            // Appreciation & Gratitude
            "Thank you for being the rose in my life - beautiful, supportive, and always there. 🌹",
            "This rose is a small way to say thank you for everything you do. 🌹",
            "I appreciate you more than words can say. This rose carries my gratitude. 🌹",
            "Thank you for adding color and fragrance to my life, just like a rose does. 🌹",
            "This rose represents my heartfelt thanks for your presence in my life. 🌹",
            "I'm grateful for you every day, but today I want to express it with this rose. 🌹",
            "Thank you for being you - unique, beautiful, and precious like a rare rose. 🌹",
            "This rose carries my appreciation for all the little things you do. 🌹",
            "Thank you for making my world more beautiful, just like roses do. 🌹",
            "I appreciate your friendship/love more than you'll ever know. Happy Rose Day! 🌹",

            // New Beginnings
            "Like a rose bud ready to bloom, may this Rose Day mark new beginnings for you. 🌹",
            "This rose represents hope for beautiful new chapters in your life. 🌹",
            "May this Rose Day be the start of wonderful new relationships and opportunities. 🌹",
            "Like a rose that blooms anew each season, may you find fresh starts and new hopes. 🌹",
            "This rose carries wishes for new beginnings and beautiful journeys ahead. 🌹",
            "May the roses of today blossom into beautiful memories tomorrow. 🌹",
            "New beginnings are like rose buds - full of potential and promise. 🌹",
            "This Rose Day, may you find the courage to start anew and bloom beautifully. 🌹",
            "Like a rose garden after winter, may your life see beautiful new growth. 🌹",
            "This rose symbolizes the fresh starts and new opportunities waiting for you. 🌹",

            // Self-Love & Empowerment
            "Be your own rose - beautiful, strong, and worthy of love and care. 🌹",
            "This rose is for you - to remind you to love yourself as much as you love others. 🌹",
            "You don't need someone to give you roses when you can be your own beautiful flower. 🌹",
            "Like a rose that doesn't need validation to bloom, be confident in your own beauty. 🌹",
            "This Rose Day, remember to love and appreciate the wonderful person you are. 🌹",
            "You are enough, you are worthy, you are beautiful - just like this rose. 🌹",
            "Be the rose in your own life - stand tall, bloom beautifully, and don't let thorns stop you. 🌹",
            "This rose represents the love and respect you should always have for yourself. 🌹",
            "Like a rose that blooms in its own time, embrace your unique journey. 🌹",
            "You are the gardener of your own life - plant roses of self-love and watch yourself bloom. 🌹",

            // Final Rose Blessings
            "May your life be surrounded by the fragrance of love and the beauty of roses. 🌹",
            "Wishing you a rose-filled life full of love, joy, and beautiful relationships. 🌹",
            "May every day be Rose Day in your heart, filled with love and happiness. 🌹",
            "May the beauty of roses remind you of the beauty within you and around you. 🌹",
            "Wishing you endless roses and infinite love throughout your life. 🌹",
            "May your relationships be as lasting and beautiful as the memory of a perfect rose. 🌹",
            "May the spirit of Rose Day stay in your heart throughout the year. 🌹",
            "Wishing you a life that blooms as beautifully as the most perfect rose. 🌹",
            "May love surround you like the fragrance of roses surrounds a garden. 🌹",
            "May every rose you receive remind you of how loved and special you are. 🌹"
        ];

        // Select random rose message
        const randomRose = roseMessages[Math.floor(Math.random() * roseMessages.length)];

        // Create the final message with header
        const finalMessage = `🌹 *ROSE DAY SPECIAL* 🌹\n\n` +
                           `${randomRose}\n\n` +
                           `*${settings.packname || 'GAAJU-XMD'}* 🤖 | *200+ Rose Messages*`;

        // Send the rose day message
        await sock.sendMessage(chatId, {
            text: finalMessage,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'Gᴀᴀᴊᴜ-Xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Error in roseday command:', error);
        
        await sock.sendMessage(chatId, {
            text: '*❌ Failed to generate Rose Day message!*\n\nPlease try again later.',
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363406588763460@newsletter',
                    newsletterName: 'Gᴀᴀᴊᴜ-Xᴍᴅ',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    }
}

module.exports = rosedayCommand;
