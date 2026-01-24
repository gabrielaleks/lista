-- migrate:up
INSERT INTO core.li_lists (id, updated_at, created_at)
VALUES (
    'b1be8154-db0a-44e4-8db6-1f8553633883',
    '2026-01-23 18:20:36.565000',
    '2026-01-23 18:20:38.090000'
);

--
INSERT INTO core.li_list_items (id, list_id, name, type, was_bought)
VALUES ('63d24704-df0d-4950-8674-8d18e0f1791e', 'b1be8154-db0a-44e4-8db6-1f8553633883', 'Spaghetti Barilla', 'UNIT', true);

INSERT INTO core.li_list_items (id, list_id, name, type, was_bought)
VALUES ('9d084152-340b-4fc1-8c97-f05698527b3a', 'b1be8154-db0a-44e4-8db6-1f8553633883', 'Poulet innenfilet mignon', 'KG', true);

INSERT INTO core.li_list_items (id, list_id, name, type, was_bought)
VALUES ('a59bb08b-ae4a-4bde-95f5-c5d3d3e4e8bf', 'b1be8154-db0a-44e4-8db6-1f8553633883', 'Tomaten Dattel Perla', 'KG', true);

INSERT INTO core.li_list_items (id, list_id, name, type, was_bought)
VALUES ('e0bbc5a9-88ba-4f57-84a7-9b44acd0f41a', 'b1be8154-db0a-44e4-8db6-1f8553633883', 'Leite', 'UNIT', false);

INSERT INTO core.li_list_items (id, list_id, name, type, was_bought)
VALUES ('99c64830-b863-4ff4-ae47-b705a84bdf80', 'b1be8154-db0a-44e4-8db6-1f8553633883', 'Açúcar', 'UNIT', false);

--
INSERT INTO core.li_items_unit (id, list_items_id, total_quantity, unity_price)
VALUES ('cc98a261-ba5b-4f2f-9c68-eba1a3f38021', '63d24704-df0d-4950-8674-8d18e0f1791e', 3, 2.50);

INSERT INTO core.li_items_unit (id, list_items_id, total_quantity, unity_price)
VALUES ('df740077-d4ff-423a-9c82-43cdfc6611a2', 'e0bbc5a9-88ba-4f57-84a7-9b44acd0f41a', 2, 1.65);

INSERT INTO core.li_items_unit (id, list_items_id, total_quantity, unity_price)
VALUES ('a6690744-c3bc-4311-a91e-3d6ff5fe5cde', '99c64830-b863-4ff4-ae47-b705a84bdf80', 1, 1.50);

-- 
INSERT INTO core.li_items_kg (id, list_items_id, total_weight, kg_price)
VALUES ('aeeca81d-5c16-412d-ae88-2df2165b81a2', '9d084152-340b-4fc1-8c97-f05698527b3a', 0.28, 25.00);

INSERT INTO core.li_items_kg (id, list_items_id, total_weight, kg_price)
VALUES ('ecc273b5-32a2-4626-b2b3-9234b44558ea', 'a59bb08b-ae4a-4bde-95f5-c5d3d3e4e8bf', 0.40, 3.80);

-- migrate:down

