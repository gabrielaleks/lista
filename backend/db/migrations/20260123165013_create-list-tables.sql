-- migrate:up
CREATE TYPE core.item_type AS ENUM ('UNIT', 'KG');

CREATE TABLE IF NOT EXISTS core.li_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    updated_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS core.li_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    type core.item_type NOT NULL,
    was_bought BOOLEAN NOT NULL,

    FOREIGN KEY (list_id) REFERENCES core.li_lists(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS li_list_items_list_id_idx ON core.li_list_items (list_id ASC);

CREATE TABLE IF NOT EXISTS core.li_items_unit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_items_id UUID NOT NULL,
    total_quantity INTEGER NOT NULL,
    unity_price NUMERIC(10, 2) NOT NULL,

    FOREIGN KEY (list_items_id) REFERENCES core.li_list_items(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS li_items_unit_id_idx ON core.li_items_unit (list_items_id ASC);

CREATE TABLE IF NOT EXISTS core.li_items_kg (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_items_id UUID NOT NULL,
    total_weight NUMERIC(10, 3) NOT NULL,
    kg_price NUMERIC(10, 2) NOT NULL,

    FOREIGN KEY (list_items_id) REFERENCES core.li_list_items(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS li_items_kg_id_idx ON core.li_items_kg (list_items_id ASC);


-- migrate:down
DROP TABLE IF EXISTS core.li_items_kg;
DROP TABLE IF EXISTS core.li_items_unit;
DROP TABLE IF EXISTS core.li_list_items;
DROP TABLE IF EXISTS core.li_lists;

DROP TYPE IF EXISTS core.item_type;
