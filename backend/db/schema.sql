SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: core; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA core;


--
-- Name: item_type; Type: TYPE; Schema: core; Owner: -
--

CREATE TYPE core.item_type AS ENUM (
    'UNIT',
    'KG'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: li_items_kg; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.li_items_kg (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    list_items_id uuid NOT NULL,
    total_weight numeric(10,3) NOT NULL,
    kg_price numeric(10,2) NOT NULL
);


--
-- Name: li_items_unit; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.li_items_unit (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    list_items_id uuid NOT NULL,
    total_quantity integer NOT NULL,
    unity_price numeric(10,2) NOT NULL
);


--
-- Name: li_list_items; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.li_list_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    list_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    type core.item_type NOT NULL,
    was_bought boolean NOT NULL
);


--
-- Name: li_lists; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.li_lists (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: core; Owner: -
--

CREATE TABLE core.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: li_items_kg li_items_kg_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.li_items_kg
    ADD CONSTRAINT li_items_kg_pkey PRIMARY KEY (id);


--
-- Name: li_items_unit li_items_unit_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.li_items_unit
    ADD CONSTRAINT li_items_unit_pkey PRIMARY KEY (id);


--
-- Name: li_list_items li_list_items_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.li_list_items
    ADD CONSTRAINT li_list_items_pkey PRIMARY KEY (id);


--
-- Name: li_lists li_lists_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.li_lists
    ADD CONSTRAINT li_lists_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: li_items_kg_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX li_items_kg_id_idx ON core.li_items_kg USING btree (list_items_id);


--
-- Name: li_items_unit_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX li_items_unit_id_idx ON core.li_items_unit USING btree (list_items_id);


--
-- Name: li_list_items_list_id_idx; Type: INDEX; Schema: core; Owner: -
--

CREATE INDEX li_list_items_list_id_idx ON core.li_list_items USING btree (list_id);


--
-- Name: li_items_kg li_items_kg_list_items_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.li_items_kg
    ADD CONSTRAINT li_items_kg_list_items_id_fkey FOREIGN KEY (list_items_id) REFERENCES core.li_list_items(id) ON DELETE CASCADE;


--
-- Name: li_items_unit li_items_unit_list_items_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.li_items_unit
    ADD CONSTRAINT li_items_unit_list_items_id_fkey FOREIGN KEY (list_items_id) REFERENCES core.li_list_items(id) ON DELETE CASCADE;


--
-- Name: li_list_items li_list_items_list_id_fkey; Type: FK CONSTRAINT; Schema: core; Owner: -
--

ALTER TABLE ONLY core.li_list_items
    ADD CONSTRAINT li_list_items_list_id_fkey FOREIGN KEY (list_id) REFERENCES core.li_lists(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO core.schema_migrations (version) VALUES
    ('20260123162702'),
    ('20260123165013'),
    ('20260123172057'),
    ('20260123172101');
