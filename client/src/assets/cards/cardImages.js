const cardImages = import.meta.glob('./*.svg', { eager: true });

const formattedCardImages = {};

for (const path in cardImages) {
    const cardName = path.replace('./', '').replace('.svg', '');
    formattedCardImages[cardName] = cardImages[path].default;
}

export default formattedCardImages;