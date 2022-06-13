import ghpages from 'gh-pages';

(async function () {
  function ghPagesPromise() {
    return new Promise((resolve, reject) => {
      ghpages.publish(
        'static',
        {
          repo: 'https://github.com/cvuong/ghpages-test.git',
          user: {
            name: 'Publish Docs',
            email: 'test@test.com',
          },
        },
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  const res = await ghPagesPromise();
  if (!res) {
    console.log('Success');
  } else {
    console.log('Error');
  }
})();
