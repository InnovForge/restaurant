import camelcaseKeys from "camelcase-keys";

const camelCase = () => {
  return function (req, res, next) {
    req.body = camelcaseKeys(req.body, { deep: true });
    req.params = camelcaseKeys(req.params);
    req.query = camelcaseKeys(req.query);

    const originalSend = res.send;
    res.send = function (body) {
      if (body) {
        body = camelcaseKeys(JSON.parse(body), { deep: true });
        return originalSend.call(this, JSON.stringify(body));
      }
      return originalSend.call(this, body);
    };
    next();
  };
};

export { camelCase };
