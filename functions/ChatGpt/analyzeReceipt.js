export default async function(base64Data) {

    const [ kojo, logger ] = this;
    const { openAi } = kojo.state;

    try {
        logger.debug('send request to chatGPT: analyze image');
        const chatGptResponse = await openAi.chat.completions.create({
            response_format: { type: 'json_object' },
            model: 'o4-mini-2025-04-16',
            messages: [{
                role: 'user',
                content: [
                    { type: 'text', text: 'Analyze this receipt and return the following information:' +
                            'json object with receipt id, shop name, location and country and array of data objects ' +
                            'with category, sub-category, name, translated name, unit count, price as amount and currency.' },
                    { type: 'image_url', image_url: { url: base64Data }}
                ]
            }],
        });

        const data = JSON.parse(chatGptResponse.choices[0].message.content);
        logger.debug(data);
        return data;

    } catch (error) {
        logger.error(error.message)
    }
}
