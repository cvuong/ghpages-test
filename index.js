import ghpages from 'gh-pages';

(function () {
  ghpages.publish('dist', (err) => {
    console.error(err);
  });
})();
