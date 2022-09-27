LABEL "com.github.actions.name"="React Deploy over SSH"
LABEL "com.github.actions.description"="Upload contents of build directory through SSH"
LABEL "com.github.actions.icon"="upload"
LABEL "com.github.actions.color"="green"

ENV PATH /github/workspace/node_modules/.bin:$PATH
ADD deploy.sh /deploy.sh
RUN chmod +x /deploy.sh
ENTRYPOINT ["/deploy.sh"]