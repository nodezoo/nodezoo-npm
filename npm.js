/* Copyright (c) 2014-2015 Richard Rodger, MIT License */
/* jshint node:true, asi:true, eqnull:true */
'use strict';
const REQUEST = require('REQUEST');



module.exports = function npm( options ){

    let seneca = this;

    options = seneca.util.deepextend({
        registry: 'http://registry.npmjs.org/'
    },options);


    seneca.add( 'role:npm,cmd:get', cmd_get );
    seneca.add( 'role:npm,cmd:query', cmd_query );
    seneca.add( 'role:npm,cmd:extract', cmd_extract );

    seneca.add('role:entity,cmd:save,name:npm',override_index);


    const cmd_get = function ( args, done ) {

        const seneca  = this;
        const npm_ent = seneca.make$('npm');

        const npm_name = args.name;

        npm_ent.load$( npm_name, (err,npm_value) => {

            if ( err ) {
                return done(err);
            }

            if ( npm_value && !args.update ) {
                return done(null,npm_value);
            }
            seneca.act(
                'role:npm,cmd:query',
                { name:npm_name },
                done);
        });
    };


    const cmd_query = function ( args, done ) {

        const seneca  = this;
        const npm_ent = seneca.make$('npm');

        const npm_name = args.name;

        const url = options.registry + npm_name;
        REQUEST.get( url, (err,res,body) => {

            if (err) {
                return done(err);
            }

            const data = JSON.parse(body);

            seneca.act('role:npm,cmd:extract',{ data:data }, (err,data_value) => {

                if (err) {
                    return done(err);
                }

                npm_ent.load$(npm_name, (err,npm_value) => {

                    if ( err ) {
                        return done(err);
                    }

                    if ( npm ) {
                        return npm_value.data$(data).save$(done);
                    }
                    data.id$ = npm_name;
                    npm_ent.make$(data).save$(done);
                });

            });
        });
    };


    const cmd_extract = function ( args, done ) {
    //var seneca  = this  --unused line

        const data       = args.data;
        const dist_tags  = data['dist-tags'] || {};
        const latest     = ((data.versions || {})[dist_tags.latest]) || {};
        const repository = latest.repository || {};

        const out = {
            name:    data._id,
            version: dist_tags.latest,
            giturl:  repository.url,
            desc:    data.description || '',
            readme:  data.readme || ''
        };

        done(null,out);
    };



    const override_index = function ( args, done ) {

        const seneca = this;

        seneca.prior(args, (err,npm_value) => {

            done(err,npm_value);

            seneca.act('role:search,cmd:insert',{ data:npm_value.data$() });
        });
    };

};
