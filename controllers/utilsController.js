exports.loaderMiddleware = (req, res, next) => {
  res.status(200).render('loader', {
    title: 'Loading...',
  });

  setTimeout(next, 1000); // Delay for 1 second (1000 milliseconds)
};
