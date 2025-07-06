from backend.database import db

class Team(db.Model):
    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    logo_url = db.Column(db.String)
    ice = db.Column(db.String)  # Identifiant Commun de l'Entreprise
    if_number = db.Column(db.String)  # Identifiant Fiscal
    cnie = db.Column(db.String)  # Carte Nationale d'Identité Électronique
    professional_tax_number = db.Column(db.String)  # Taxe professionnelle N°
    address = db.Column(db.Text)  # Business address
    phone = db.Column(db.String)  # Business phone
    email = db.Column(db.String)  # Business email
    # Relationships
    memberships = db.relationship('TeamMembership', back_populates='team')
    owner = db.relationship('User', foreign_keys=[owner_id]) 