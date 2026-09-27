def parse_query(query: str) -> str:
    """
    Parses a natural language query into a format suitable for Grounding DINO.
    Grounding DINO expects dot-separated classes.
    """
    q = query.lower()
    
    classes = []
    
    if "building" in q or "house" in q:
        classes.append("building")
    if "car" in q or "vehicle" in q or "truck" in q:
        classes.append("car")
        classes.append("vehicle")
    if "road" in q or "street" in q:
        classes.append("road")
    if "water" in q or "river" in q or "lake" in q:
        classes.append("water body")
        classes.append("river")
    if "ship" in q or "boat" in q:
        classes.append("ship")
        classes.append("boat")
    if "tree" in q or "vegetation" in q or "forest" in q:
        classes.append("tree")
        classes.append("forest")
    if "solar panel" in q:
        classes.append("solar panel")
        
    if not classes:
        # Fallback to the original query if no mapping matched
        # Replacing commas and 'and' with dots
        q = q.replace(" and ", " . ").replace(",", " . ")
        return q.strip()
        
    return " . ".join(classes)
