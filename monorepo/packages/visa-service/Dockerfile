FROM image-registry.openshift-image-registry.svc:5000/openshift/httpd@sha256:2edb9f54409b68982241f4eddb22db02b29b8ef6b06179ec166cb6e8c4e47b80
WORKDIR /test
COPY . /test
COPY ./packages/httpd-custom.conf /usr/local/apache2/conf/httpd.conf 
COPY dist /usr/local/apache2/htdocs/visa-service
RUN chmod -R 777 /usr/local/apache2/logs
