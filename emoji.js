const path = require('path');
const fromPairs = require('lodash.frompairs');
const emoji = require('emoji-datasource-twitter/emoji');

function defineEmoji(data, callback) {
  const pairs = emoji.filter(e => e.has_img_twitter).map((e) => {
    const name = e.short_name;
    const aliases = e.short_names.slice(1);
    const ascii = (e.texts || []).map(x => x.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    const character = e.unified
      .split('-')
      .map(code => String.fromCodePoint(parseInt(code, 16)))
      .join('');
    let category = e.category.toLowerCase();
    if (category === 'skin tones') { category = 'modifier'; }
    else if (category === 'food & drink') { category = 'food'; }
    else if (category === 'travel & places') { category = 'travel'; }
    else if (category === 'people & body') { category = 'people'; }
    else if (category === 'smileys & emotion') { category = 'people'; }
    else if (category === 'animals & nature') { category = 'nature'; }
    else if (category === 'activities') { category = 'activity'; }

    return [name, {
      aliases,
      ascii,
      character,
      categories: [category],
      keywords: e.keywords,
      image: e.image,
    }];
  });

  const dictionary = fromPairs(pairs);

  data.packs.push({
    name: 'Twemoji',
    id: 'twemoji2',
    path: __dirname,
    attribution: 'From <a href="https://github.com/iamcal/emoji-data" target="_blank" rel="noopener">iamcal/emoji-data on Github</a>',
    license: '<a href="https://github.com/twitter/twemoji/blob/master/LICENSE-GRAPHICS">Creative Commons Attribution 4.0 International Public License</a>',
    mode: 'images',
    images: {
      directory: path.join(path.dirname(require.resolve('emoji-datasource-twitter')), 'img/twitter/64'),
    },
    dictionary,
  });

  callback(null, data);
}

module.exports.defineEmoji = defineEmoji;
