const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const PROBOT_ID = '282859044593598464';
const recipientId = '1196912956500353064';
const fullPrice = 6;
const receivedPrice = 5;
const roleId = '1256589553284939806';

client.on('messageCreate', async message => {
    if (message.content === '$buy') {
        // إرسال أمر الكريدت
        await message.channel.send(`\`\`\`#credit ${recipientId} ${fullPrice}\`\`\``);

        // إعداد فلتر الرسائل للتحقق من وصول المبلغ
        const filter = m => m.author.id === PROBOT_ID 
            && m.content.includes(`${receivedPrice}`) 
            && m.content.includes(`${recipientId}`) 
            && m.content.includes(message.author.username);

        // انتظار الرد من Probot
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', async m => {
            // عند مطابقة الرسالة، يتم إعطاء الرتبة
            const member = message.guild.members.cache.get(message.author.id);
            if (member) {
                await member.roles.add(roleId);
                await message.channel.send(`تمت إضافة الرتبة لك بنجاح!`);
            }
            collector.stop(); // إيقاف التجميع بعد النجاح
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.channel.send('لم يتم استلام تأكيد الدفع في الوقت المحدد.');
            }
        });
    }
});

client.login('your-bot-token');
