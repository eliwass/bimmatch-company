import React, { useEffect } from "react";
import debounce from "lodash.debounce";
import { useQuery } from "@apollo/client";
import Masonry from "react-masonry-component";
import ProjectCard from "./project-card";

const ProjectsList = ({ graphQuery, first, outputKey }) => {
  const { loading, data = {}, fetchMore } = useQuery(graphQuery, {
    variables: {
      first,
    },
  });

  const loadMoreProjects = debounce((dataForMore) => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      const pageInfo = data && data[outputKey] && data[outputKey].pageInfo;
      if (pageInfo && pageInfo.hasNextPage) {
        fetchMore({
          variables: {
            first,
            after: pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult } = {}) => {
            const results = fetchMoreResult[outputKey] || {};
            const { edges: newEdges, pageInfo, totalCount } = results;
            if (newEdges.length) {
              const newdata = {};
              newdata[outputKey] = {
                __typename: previousResult[outputKey].__typename,
                edges: [...previousResult[outputKey].edges, ...newEdges],
                pageInfo,
                totalCount,
              };
              return newdata;
            }
            return previousResult;
          },
        });
      }
    }
  }, 250);

  useEffect(() => {
    window.onscroll = () => {
      loadMoreProjects(data);
    };
    return () => {
      window.onscroll = null;
    };
  }, [data, loadMoreProjects]);

  const projects = data && data[outputKey] && data[outputKey].edges;

  return (
    <div className="row">
      <div className="col-12">
        <Masonry
          className="custom-card project-card project-list-card"
          options={{ transitionDuration: 100 }}
        >
          {projects &&
            projects.map((edge) => (
              <ProjectCard house={edge.node} key={edge.node.id} />
            ))}
        </Masonry>
        {!(projects && projects.length > 0) && !loading && (
          <h3>No projects available.</h3>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
