import core from '@actions/core';
// import github from '@actions/github';

// import ghpages from 'gh-pages';

// (async function () {
//   function ghPagesPromise() {
//     return new Promise((resolve, reject) => {
//       ghpages.publish(
//         'static',
//         {
//           repo: 'https://github.com/cvuong/ghpages-test.git',
//           user: {
//             name: 'github-actions-bot',
//             email: 'test@test.com',
//           },
//           dest: 'blah1',
//         },
//         (err) => {
//           if (err) {
//             reject(err);
//             return;
//           }
//           resolve();
//         }
//       );
//     });
//   }

//   const res = await ghPagesPromise();
//   if (!res) {
//     console.log('Success');
//   } else {
//     console.log('Error');
//   }
// })();

(async function () {
  console.log('top of function');
  console.log('core', core);
  // const token = core.getInput('token');
  // console.log('token', token);
  // const octokit = github.getOctokit(token);
  // const { data } = await octokit.rest.pulls.get();
  // console.log('data', data);
})();
