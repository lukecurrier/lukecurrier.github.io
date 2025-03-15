# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "lukecurrier-jekyll-theme"
  spec.version       = "1.0.0"
  spec.authors       = ["Luke Currier"]
  spec.email         = ["lukescurrier@gmail.com"]

  spec.summary       = "Personal Jekyll theme for Luke Currier's website, adapted from Dattali's Beautiful Jekyll"
  spec.homepage      = "https://lukecurrier.github.io"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r{^(assets|_layouts|_includes|LICENSE|README|feed|404|_data|tags|staticman)}i) }

  spec.metadata      = {
    "documentation_uri" => "https://github.com/lukecurrier/lukecurrier.github.io#readme"
  }

  spec.add_runtime_dependency "jekyll", "~> 3.9.3"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.4"
  spec.add_runtime_dependency "kramdown-parser-gfm", "~> 1.1"
  spec.add_runtime_dependency "kramdown", "~> 2.3.2"
  spec.add_runtime_dependency "webrick", "~> 1.8"

  spec.add_development_dependency "bundler", ">= 1.16"
  spec.add_development_dependency "rake", "~> 12.0"
end
