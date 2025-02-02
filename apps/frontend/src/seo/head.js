import { Helmet, HelmetData } from "react-helmet-async";

const helmetData = new HelmetData({});

export const Head = ({ title = "", description = "" }) => {
  return (
    <Helmet helmetData={helmetData} title={title ? `${title} | React` : undefined} defaultTitle="React">
      <meta name="description" content={description} />
    </Helmet>
  );
};
