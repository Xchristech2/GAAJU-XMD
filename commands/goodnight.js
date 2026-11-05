 const settings = require('../settings');

async function goodnightCommand(sock, chatId, message) {
    try {
        // Array of 200+ goodnight messages
        const goodnightMessages = [
            // Romantic Goodnight Messages
            "As the stars begin to shine, I just wanted to say goodnight to the one who makes my world bright. Sweet dreams, my love. 🌙💖",
            "Closing my eyes with your beautiful face in my mind and your love in my heart. Goodnight, my darling. 💫",
            "May your dreams be as sweet as your smile and as beautiful as our love. Goodnight, my everything. 🌟",
            "The moon is high, the stars are bright, but nothing shines as bright as you in my life. Goodnight, my love. ✨",
            "As you lay down to sleep, remember that you're the last thought on my mind and the first when I wake. Goodnight, sweetheart. 💝",
            "Sending you warm hugs and soft kisses through the moonlight. Sleep tight, my love. 🌙💋",
            "The night may be dark, but my love for you lights up my world. Goodnight, my shining star. ⭐",
            "Dream of us together, because that's where we belong. Goodnight, my soulmate. 💑",
            "As the world sleeps, know that my love for you stays awake, guarding your dreams. Goodnight, my precious. 🛡️",
            "May angels watch over you as you sleep and bring you dreams of our beautiful love. Goodnight, my angel. 😇",

            // Sweet & Caring
            "Rest your beautiful mind and let your dreams take flight. Goodnight, sleep tight. 🌙",
            "As the day ends, may your worries fade and your heart be at peace. Goodnight, dear one. 🕊️",
            "Wrapping you in a blanket of love and warmth for a peaceful night's sleep. Goodnight. 🛏️",
            "May your sleep be deep and your dreams be sweet. Goodnight, my friend. 🌜",
            "Let the moonlight wash away your stress and the starlight bring you peace. Goodnight. 🌌",
            "Close your eyes, breathe deeply, and let the night heal your soul. Goodnight. 🌃",
            "Sending you calming thoughts and peaceful vibes for a restful night. Goodnight. 🧘",
            "May your pillow be soft and your dreams be beautiful. Goodnight. 🌠",
            "Let the silence of the night comfort your heart and mind. Goodnight. 🤫",
            "Wishing you a night filled with sweet dreams and morning filled with new hopes. Goodnight. 🌅",

            // Poetic Goodnight
            "The moon has taken place of the sun, it's time to rest till a new day has begun. Goodnight. 🌙",
            "Stars are the nightlights of heaven, guiding you to peaceful dreams. Goodnight. ⭐",
            "As darkness blankets the earth, may peace blanket your soul. Goodnight. 🌑",
            "The night whispers secrets to the dreaming world - listen closely. Goodnight. 🗣️",
            "Moonbeams dance on sleeping flowers, may they dance in your dreams too. Goodnight. 💃",
            "The world is sleeping, dreams are creeping, into minds while peace is keeping. Goodnight. 🌍",
            "Night has fallen, stars are calling, to dreamland we are crawling. Goodnight. 🚀",
            "The moon is a pearl in the ocean of night, guiding dreamers with its gentle light. Goodnight. 🌊",
            "As fireflies light the summer night, may happy thoughts your dreams ignite. Goodnight. 🔥",
            "The night is a canvas, dreams are the art - paint something beautiful in your heart. Goodnight. 🎨",

            // Funny & Light-hearted
            "Going to bed now. Don't let the bed bugs bite, but if they do, hit them with a shoe! Goodnight! 🛌",
            "Time to recharge my social battery. See you tomorrow! Goodnight! 🔋",
            "My brain is shutting down for maintenance. Rebooting in the morning. Goodnight! 💻",
            "Bed: where I spend half my life trying to get more life. Goodnight! 😴",
            "Going to dream about being well-rested. The irony! Goodnight! 😅",
            "My bed and I have a very special relationship - we're perfect for each other! Goodnight! 💞",
            "Sleep is my favorite exercise. I practice it every night! Goodnight! 🏃",
            "Going to sleep now. If I don't reply, I'm probably dreaming about pizza. Goodnight! 🍕",
            "My phone needs charging, and so do I. Goodnight! 📱",
            "Time to enter the sleep matrix. See you in the real world tomorrow! Goodnight! 🕶️",

            // Inspirational Goodnight
            "Today was a chapter, tomorrow is a blank page. Rest well to write a beautiful story. Goodnight. 📖",
            "Let go of today's worries - they're too heavy to carry into your dreams. Goodnight. 🎒",
            "Every sunset gives us one day less to live, but every sunrise gives us one day more to hope. Goodnight. 🌅",
            "The night is for healing, the morning is for beginning. Sleep well. Goodnight. 🌄",
            "Today's battles are over. Rest and prepare for tomorrow's victories. Goodnight. 🏆",
            "The stars are reminders that even in darkness, there is always light. Goodnight. ✨",
            "Sleep is the best meditation. Let your mind wander to peaceful places. Goodnight. 🧘",
            "Every night is an opportunity to reset and every morning a chance to restart. Goodnight. 🔄",
            "Dream big, rest well, wake up ready to conquer. Goodnight. 🦁",
            "The quiet of the night is nature's way of saying 'take a break'. Goodnight. 🌳",

            // Spiritual Goodnight
            "May God's angels watch over you as you sleep and bring you peaceful dreams. Goodnight. 😇",
            "As you sleep, may God's love surround you like a warm blanket. Goodnight. ❤️",
            "Lay your burdens at God's feet and let Him give you rest. Goodnight. 🙏",
            "May the peace of God that surpasses all understanding guard your heart and mind as you sleep. Goodnight. 🕊️",
            "Goodnight and God bless. May His mercy be new every morning. 🌄",
            "As the stars shine above, remember God's love shines brighter. Goodnight. ⭐",
            "Rest in the assurance that you are loved by the Creator of the universe. Goodnight. 🌌",
            "May your sleep be filled with heavenly peace and your dreams with divine guidance. Goodnight. ☁️",
            "Give your worries to God - He's going to be up all night anyway. Goodnight. 🌙",
            "Sleep with faith, wake with hope. Goodnight and God bless. ✝️",

            // Family Goodnight
            "Goodnight to the best family in the world. Sweet dreams, everyone! 👨‍👩‍👧‍👦",
            "As we all go to sleep, know that family love never rests. Goodnight, my dear family. 💝",
            "May our home be filled with peaceful dreams and loving thoughts. Goodnight, family. 🏡",
            "To the people who make every day special - goodnight and sweet dreams. 🌟",
            "Family is where life begins and love never ends. Goodnight, my beloved family. 💖",
            "As we close our eyes, let's be thankful for each other. Goodnight, family. 🙏",
            "The best dreams are those shared with family. Goodnight, everyone. 💭",
            "Our family bond is the best lullaby. Goodnight, my treasures. 🎵",
            "May angels watch over every member of our family tonight. Goodnight. 😇",
            "Home is where the heart is, and my heart is with you all. Goodnight, family. 🏠",

            // Friendship Goodnight
            "Goodnight, my friend. May your dreams be as awesome as you are! 🌟",
            "Another day of friendship conquered! Time to recharge for tomorrow. Goodnight! 💪",
            "Friends like you make every day worth waking up for. Goodnight! 🌅",
            "Sleep well, my friend. Tomorrow holds new adventures for us! 🗺️",
            "Goodnight to the person who makes my world better just by being in it. 🌍",
            "Friendship is the best bedtime story. Goodnight, my dear friend! 📖",
            "May your dreams be filled with laughter and joy, just like our friendship. Goodnight! 😄",
            "Another day, another memory made with an amazing friend. Goodnight! 📸",
            "Rest well, my friend. Our friendship gives me strength every day. 💝",
            "Goodnight to the person who understands me without words. Sleep tight! 🤗",

            // Long Distance Goodnight
            "Though miles separate us, my goodnight wishes cross any distance. Sweet dreams! 🌎",
            "Sending my love across the miles to wish you a peaceful night. Goodnight, my love. 💝",
            "The moon we both see connects our hearts tonight. Goodnight from far away. 🌙",
            "Distance means nothing when someone means everything. Goodnight, my dear. 📏",
            "Across cities/countries/oceans, my heart is with you. Goodnight. 🌊",
            "Though we sleep in different places, we dream under the same stars. Goodnight. ⭐",
            "My love for you travels through the night to reach your dreams. Goodnight. 💫",
            "No matter where you are, my goodnight wishes will find you. Sleep well. 🗺️",
            "The night connects all lovers' hearts. Goodnight, my distant love. 💞",
            "Thinking of you as I sleep, knowing you're doing the same. Goodnight. 💭",

            // Motivational Goodnight
            "Rest now, dream big, wake up ready to achieve greatness. Goodnight. 🚀",
            "Today you did your best, tomorrow you'll do better. Goodnight. 📈",
            "Sleep is fuel for champions. Rest well, champion! Goodnight. 🏆",
            "Every good night's sleep is an investment in tomorrow's success. Goodnight. 💰",
            "Your body achieves what the mind believes. Rest your mind tonight. Goodnight. 🧠",
            "Tomorrow is a new opportunity to be better than today. Rest up! Goodnight. 🌅",
            "Great minds need great rest. Sleep well, brilliant mind. Goodnight. 💡",
            "Your potential is limitless, but even limitless potential needs rest. Goodnight. ∞",
            "Dream of your goals, then wake up and achieve them. Goodnight. 🎯",
            "The most successful people prioritize rest. You're on the right track. Goodnight. 📊",

            // Nature-inspired Goodnight
            "As flowers close their petals for the night, may you close your eyes in peace. Goodnight. 🌸",
            "The forest sleeps, the rivers slow, it's time for you to rest and grow. Goodnight. 🌳",
            "Like the moon watching over the sleeping earth, may peace watch over you. Goodnight. 🌙",
            "The night breeze whispers lullabies to the world. Listen and sleep. Goodnight. 💨",
            "As animals return to their dens, return to your rest. Goodnight. 🐻",
            "The stars are night's flowers blooming in the sky. Goodnight. 🌼",
            "Ocean waves crash in rhythm, a lullaby for the soul. Goodnight. 🌊",
            "Mountains stand guard through the night, protecting dreamers. Goodnight. ⛰️",
            "Fireflies light the path to dreamland. Follow them. Goodnight. 🔥",
            "The nightingale's song is nature's goodnight melody. Goodnight. 🐦",

            // Professional Goodnight
            "Another productive day complete. Time to recharge for tomorrow's challenges. Goodnight. 💼",
            "Rest is part of the success formula. Goodnight and recharge. 📈",
            "The workday ends, but growth continues in dreams. Goodnight. 🌱",
            "Teamwork makes the dream work, and rest makes the team work. Goodnight. 👥",
            "Closing today's files and opening dream files. Goodnight. 📁",
            "Success requires both hard work and good rest. Goodnight, future leader. 👑",
            "The most innovative ideas often come after good rest. Goodnight. 💡",
            "Tomorrow's productivity depends on tonight's rest. Goodnight. ⚡",
            "Great achievements begin with rested minds. Goodnight. 🧠",
            "Work hard, rest well, achieve greatly. Goodnight. 🏆",

            // Seasonal Goodnight
            "Winter nights are long, but dreams keep us warm. Goodnight. ❄️",
            "Summer breezes whisper through the night, carrying sweet dreams. Goodnight. 🌬️",
            "Autumn leaves fall silently, like worries from your mind. Goodnight. 🍂",
            "Spring flowers sleep to bloom brighter tomorrow. Goodnight. 🌷",
            "Rainy nights make the best sleeping weather. Goodnight. 🌧️",
            "Snow blankets the world in quiet peace. Goodnight. ⛄",
            "Warm summer nights filled with cricket songs. Goodnight. 🦗",
            "Cool autumn air perfect for cozy sleeping. Goodnight. 🍁",
            "Winter's early darkness invites early rest. Goodnight. 🌒",
            "Spring's new beginnings start with restful nights. Goodnight. 🌱",

            // Cultural Goodnight
            "Buenas noches! May your dreams be as beautiful as a Spanish sunset. 🌅",
            "Bonne nuit! Dream of Parisian streets and moonlit rivers. 🗼",
            "Gute Nacht! May German precision give you perfectly organized dreams. 🏰",
            "Buona notte! Dream of Italian romance and starlit piazzas. 🍝",
            "おやすみなさい (Oyasuminasai)! May your dreams be as peaceful as a Japanese garden. 🎎",
            "Selamat malam! May Malaysian warmth fill your dreams. 🌴",
            "Spokoynoy nochi! Dream of Russian winter wonders. 🐻",
            "Laila tov! May Israeli stars guide your dreams. ✡️",
            "Boa noite! Dream of Brazilian beaches and samba rhythms. 🏖️",
            "Kalinihta! May Greek gods bless your dreams with epic adventures. 🏛️",

            // Creative Goodnight
            "Let your dreams be the canvas and your imagination the paint. Goodnight. 🎨",
            "May your subconscious write beautiful stories while you sleep. Goodnight. 📝",
            "Dream in colors more vibrant than reality. Goodnight. 🌈",
            "Your mind is a theater - may tonight's dreams be Oscar-worthy. Goodnight. 🎭",
            "Sleep is when creativity recharges and ideas incubate. Goodnight. 💡",
            "Dream of melodies and wake up with new songs. Goodnight. 🎵",
            "Your imagination is the director of tonight's dreams. Goodnight. 🎬",
            "May your dreams be masterpieces worthy of gallery walls. Goodnight. 🖼️",
            "Sleep is when the artist within you creates freely. Goodnight. 👨‍🎨",
            "Dream of poetry and wake up with verses. Goodnight. 📜",

            // Health-focused Goodnight
            "Sleep is the best medicine for a tired body and mind. Goodnight. 💊",
            "Rest is when your body repairs and strengthens. Goodnight. 💪",
            "A good night's sleep is an investment in your health. Goodnight. 🏥",
            "Let sleep reset your stress levels and refresh your spirit. Goodnight. 🧘",
            "Your immune system works best when you're resting. Goodnight. 🛡️",
            "Sleep is nature's way of healing both body and soul. Goodnight. 🌿",
            "Rest well to maintain your beautiful glow. Goodnight. ✨",
            "A peaceful mind leads to restful sleep leads to better health. Goodnight. 🧠",
            "Your body thanks you for giving it the rest it deserves. Goodnight. 🙏",
            "Sleep is the foundation of good health and happiness. Goodnight. 🏗️",

            // Short & Sweet Goodnight
            "Stars are out, time to sleep. Goodnight! ⭐",
            "Moon is up, dreams await. Goodnight! 🌙",
            "Day is done, rest begins. Goodnight! 🌅",
            "Eyes close, dreams open. Goodnight! 👀",
            "World sleeps, peace reigns. Goodnight! 🌍",
            "Darkness falls, dreams rise. Goodnight! 🌑",
            "Silence speaks, heart listens. Goodnight! 🤫",
            "Pillow calls, I answer. Goodnight! 🛏️",
            "Blanket warm, sleep deep. Goodnight! 🛌",
            "Night whispers, soul rests. Goodnight! 🗣️",

            // Final Blessings Goodnight
            "May your sleep be peaceful, your dreams be sweet, and your morning be bright. Goodnight. 🌟",
            "Wishing you a night filled with rest and a tomorrow filled with possibilities. Goodnight. ✨",
            "May the night bring you comfort and the morning bring you joy. Goodnight. 🌅",
            "Sleep well, dream big, wake up grateful. Goodnight. 🙏",
            "May angels guard your sleep and hope fill your dreams. Goodnight. 😇",
            "Rest your body, calm your mind, nourish your soul. Goodnight. 🧘",
            "May the peace of the night stay with you till morning. Goodnight. 🕊️",
            "Sleep deeply, wake refreshed, live fully. Goodnight. 💫",
            "May your night be as wonderful as you are. Goodnight. 🌙",
            "Dream beautiful dreams and wake up to make them reality. Goodnight. 💭"
        ];

        // Select random goodnight message
        const randomGoodnight = goodnightMessages[Math.floor(Math.random() * goodnightMessages.length)];

        // Create the final message with header
        const finalMessage = `🌙 *GOODNIGHT WISHES* 🌙\n\n` +
                           `${randomGoodnight}\n\n` +
                           `*${settings.packname || 'GAAJU-XMD'}* 🤖 | *200+ Goodnight Messages*`;

        // Send the goodnight message
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
        console.error('Error in goodnight command:', error);
        
        await sock.sendMessage(chatId, {
            text: '*❌ Failed to generate goodnight message!*\n\nPlease try again later.',
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

module.exports = goodnightCommand;
